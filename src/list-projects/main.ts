import { ProjectService } from "../fetch";
import { projectPermission, type ProjectPreview } from "../types";
import "./profile"

const listDiv = document.querySelector('.project-list') as HTMLDivElement;

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


function rowEvents(row: HTMLTableRowElement, project: ProjectPreview) {
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

        rowEvents(row, project);

        listDiv.append(row)
}

