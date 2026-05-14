import { ProjectService } from "../fetch";
import { projectPermission, type ProjectPreview, type ReceivedNotification } from "../types";
import "./profile"

const listDiv = document.querySelector('.project-list') as HTMLDivElement;
const notificationsBody = document.getElementById("notifications-modal-body") as HTMLDivElement;

async function initApp() {
        const loader = document.getElementById('loader') as HTMLDivElement;
        const statusText = document.getElementById('status-text') as HTMLSpanElement;
        const retryBtn = document.getElementById('retry-btn') as HTMLButtonElement;

        const attemptLoad = async () => {
                try {
                        loader.removeAttribute('data-state');
                        loader.style.display = 'flex';
                        statusText.innerText = "Waking up server...";

                        const projectListData = await ProjectService.list();

                        const notifications = await ProjectService.fetchNotifications();

                        loadNotifications(notifications);
                        loader.style.display = 'none';
                        projectListData.forEach((project: ProjectPreview) => createRow(project));

                } catch (err) {
                        loader.setAttribute('data-state', 'error');
                        statusText.innerText = "Server connection failed.";

                        console.error("Initialization error:", err);
                }
        };

        retryBtn.addEventListener('click', attemptLoad);

        await attemptLoad();
}

initApp().catch(console.error);

async function loadNotifications(notifications: Array<ReceivedNotification>) {
        if (notifications.length == 0) {
                notificationsBody.innerHTML = `<b>No new Notifications</b>`;
                return;
        }

        const userBtn = document.getElementById("user-menu-btn") as HTMLButtonElement;
        userBtn.style.background = `var(--light-purple)`;

        const notificationBtn = document.getElementById("notifications-btn") as HTMLButtonElement;
        notificationBtn.style.background = `color-mix(in srgb, var(--primary-purple) 85%, var(--pink))`;

        const svg = notificationBtn.querySelector(".notification-btn-unread") as HTMLElement;
        svg.hidden = true;

        for (const n of notifications) {
                notificationsBody.appendChild(notificationHTML(n));
        }
}

function notificationHTML(n: ReceivedNotification): HTMLDivElement {
        const div = document.createElement("div");
        div.className = "notification";

        const showButtons = n.type === "invite" && n.state === "Pending";

        div.innerHTML = `
        <div class="notification-head">
            <div class="notification-head-left">
                <img class="notification-avatar" src="${n.from_acc.img_url}" referrerpolicy="no-referrer">
                <h5>${n.from_acc.name}</h5>
            </div>
            <button class="close-notification-btn" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                </svg>
            </button>
        </div>
        <div class="notification-content-div">
            <p class="notification-content">${n.content}</p>
            ${showButtons ? `
                <div class="notification-btn-div">
                    <button class="default-btn notification-accept-btn">Accept</button>
                    <button class="default-btn notification-decline-btn">Decline</button>
                </div>
            ` : ''}
        </div>
    `;

        const handleResponse = (status: string) => {
                ProjectService.responseNotification(n.id, status);
                div.remove();
                const notificationBtn = document.getElementById("notifications-btn") as HTMLButtonElement;
                notificationBtn.style.background = `var(--primary-purple)`;

                const svg = notificationBtn.querySelector(".notification-btn-unread") as HTMLElement;
                svg.hidden = true;
        };

        div.querySelector(".close-notification-btn")?.addEventListener("click", () => {
                handleResponse("Dismissed")
                if (notificationsBody.children.length == 0) {
                        const userBtn = document.getElementById("user-menu-btn") as HTMLButtonElement;
                        userBtn.style.background = `var(--primary-purple)`
                }
        });

        if (showButtons) {
                div.querySelector(".notification-accept-btn")?.addEventListener("click", () => handleResponse("Accepted"));
                div.querySelector(".notification-decline-btn")?.addEventListener("click", () => handleResponse("Declined"));
        }

        return div;
}

function addRowEvents(row: HTMLTableRowElement, project: ProjectPreview) {
        row.addEventListener("click", () => {
                window.location.href = `/pages/view.html?id=${project.id?.toString()}`;
        });

        const deleteBtn = row.children[row.children.length - 1].firstChild as HTMLButtonElement;
        if (project.permission_id !== projectPermission.All) {
                deleteBtn.disabled = true;
        }
        else {
                deleteBtn.addEventListener("click", async (e: Event) => {
                        e.stopPropagation();

                        row.remove();
                        await ProjectService.delete(project.id!);
                })
        }
}

function createRow(project: ProjectPreview) {
        const row = document.createElement('tr') as HTMLTableRowElement;
        row.className = "project-row";

        const date = new Date(project.date_created!).toLocaleDateString('sl-SI');

        const rowValues = [
                project.title,
                project.json!.nosilec_v_hr_procesih.value,
                project.json!.nosilec_v_obracunu_plac.value,
                date];


        for (const val of rowValues) {
                const td = document.createElement("td") as HTMLTableCellElement;
                const b = document.createElement("b") as HTMLElement;
                b.innerText = val as string;

                td.append(b);
                row.append(td);
        }

        const td = document.createElement("td");
        td.innerHTML = `<button class="remove-row-btn">Remove</button>`
        row.appendChild(td);

        addRowEvents(row, project);

        listDiv.append(row)
}

