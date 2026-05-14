import { ProjectService } from "../fetch";

window.onload = () => {
        google.accounts.id.initialize({
                client_id: "309418454128-lgp4tot2ckso2p4h8il0041c4f2e0s3n.apps.googleusercontent.com",
                callback: handleCredentialResponse,
                auto_select: false,
                ux_mode: 'popup',
        });

        google.accounts.id.renderButton(
                document.getElementById("button-div")!,
                { type: "standard", theme: "filled_blue", size: "large", width: 300, }
        );


        // google.accounts.id.prompt();

        showInitialState();
};

async function handleCredentialResponse(response: any) {
        const token = response.credential;

        try {
                await ProjectService.getOrCreateAcc(token);
                window.location.href = "/pages/list.html";
        }
        catch (err) {
                console.error(`failed to log in: ${err}`);
        }
}

function showInitialState() {
        document.getElementById("loading")!.style.display = "none";
        document.getElementById("login-form")!.style.display = "block";
}
