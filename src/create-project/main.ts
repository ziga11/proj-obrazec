import "./events"
import { setVisibilityFile, setVisibilityCheckbox, addFileToMap } from "../utils"
import { addTextAndNumberBoxes, allFileInputs, addTextBoxes, addTextToSliders, fileInputDivs, deltaFileMap } from "./html";

tinymce.init({
        selector: '#dodatne_specifike',
        plugins: 'advlist autolink lists link charmap preview anchor',
        toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
        menubar: false,
        content_style: `body { color: white; }`,
});

Array.from([...addTextBoxes, ...addTextAndNumberBoxes, ...addTextToSliders]).forEach(parentDiv => setVisibilityCheckbox(parentDiv));
Array.from(fileInputDivs).forEach(parentDiv => setVisibilityFile(parentDiv));
Array.from(allFileInputs).forEach((fileInput) => {
        fileInput.addEventListener("change", () => {
                if (fileInput.files == null) return;

                addFileToMap(deltaFileMap, fileInput, fileInput.files[0]);
        });
});
