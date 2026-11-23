import HelpScout, { type Context } from "@helpscout/javascript-sdk"

function element(id: string) {
    const node = document.getElementById(id)
    if (!node) throw new Error(`Missing sidebar element: ${id}`)
    return node
}
const panel = element("sidebar-panel")
const config = element("sidebar-config")
// Help Scout owns scrolling; resize the frame when forms expand or data changes.
let lastHeight = 0
const resize = new ResizeObserver(() => {
    const height = Math.ceil(document.body.getBoundingClientRect().height)
    if (height !== lastHeight) {
        lastHeight = height
        HelpScout.setAppHeight(height)
    }
})
resize.observe(document.body)
window.addEventListener(
    "pagehide",
    () => {
        resize.disconnect()
    },
    { once: true },
)

document.addEventListener("change", (event) => {
    if (
        !(event.target instanceof HTMLSelectElement) ||
        event.target.id !== "reason"
    )
        return
    const details = document.getElementById("other-details")
    const other = document.getElementById("other")
    const show = event.target.value === "Other"
    if (details) details.hidden = !show
    if (other instanceof HTMLTextAreaElement) other.disabled = !show
})

let currentKey = config.dataset.contextId ?? ""
let activeRequest: AbortController | undefined
let revision = 0
let latestContext: Context | undefined
const contextTimeout = window.setTimeout(() => {
    message(
        "Help Scout has not provided customer details. Reload this sidebar to retry.",
    )
}, 10000)

function message(text: string) {
    const paragraph = document.createElement("p")
    paragraph.setAttribute("role", "status")
    paragraph.textContent = text
    panel.replaceChildren(paragraph)
}

async function load(action: string, body: URLSearchParams) {
    activeRequest?.abort()
    activeRequest = new AbortController()
    const ownRevision = ++revision
    panel.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
        button.disabled = true
    })
    try {
        const response = await fetch(action, {
            method: "POST",
            body,
            signal: activeRequest.signal,
            credentials: "omit",
        })
        const html = await response.text()
        if (ownRevision !== revision) return
        const page = new DOMParser().parseFromString(html, "text/html")
        const nextPanel = page.querySelector("#sidebar-panel")
        if (!nextPanel) throw new Error("Invalid sidebar response")
        panel.innerHTML = nextPanel.innerHTML
        const nextConfig = page.querySelector<HTMLElement>("#sidebar-config")
        if (nextConfig) {
            config.dataset.token = nextConfig.dataset.token ?? ""
            currentKey = nextConfig.dataset.contextId ?? ""
        } else {
            currentKey = ""
        }
        if (!response.ok && !nextConfig) {
            const retry = document.createElement("button")
            retry.textContent = "Retry loading customer"
            retry.addEventListener("click", () => {
                if (latestContext) void updateContext(latestContext)
            })
            panel.append(retry)
        }
    } catch {
        if (ownRevision !== revision) return
        currentKey = ""
        message(
            "Could not load customer details. Reload this sidebar and try again.",
        )
    }
}

async function updateContext(context: Context) {
    window.clearTimeout(contextTimeout)
    latestContext = context
    const conversationId = context.conversation?.id
    const customerId = context.customer?.id
    const key = conversationId
        ? `conversation:${String(conversationId)}`
        : customerId
          ? `customer:${String(customerId)}`
          : ""
    if (key && key === currentKey) return
    if (!key) {
        activeRequest?.abort()
        revision++
        currentKey = ""
        message(
            config.dataset.view === "klaviyo"
                ? "Select a customer in Help Scout to view their Klaviyo profile."
                : "Select a customer in Help Scout to manage their subscription.",
        )
        return
    }
    currentKey = key
    message("Loading the customer from Help Scout…")
    const body = new URLSearchParams({ token: config.dataset.token ?? "" })
    if (conversationId) body.set("conversationId", String(conversationId))
    else if (customerId) body.set("customerId", String(customerId))
    if (context.mailbox?.id) body.set("mailboxId", String(context.mailbox.id))
    await load(config.dataset.endpoint ?? "/helpscout/sidebar/context", body)
}

// Keep the original iframe alive: SDK context must keep following the selected chat.
document.addEventListener("submit", (event) => {
    const form = event.target
    if (!(form instanceof HTMLFormElement) || !panel.contains(form)) return
    event.preventDefault()
    if (!form.reportValidity()) return
    const body = new URLSearchParams()
    new FormData(form).forEach((value, name) => {
        if (typeof value === "string") body.append(name, value)
    })
    void load(form.action, body)
})
HelpScout.watchApplicationContext((context) => {
    void updateContext(context)
})
void HelpScout.getApplicationContext()
    .then(updateContext)
    .catch(() => {
        message("Could not read the Help Scout customer. Reload this sidebar.")
    })
