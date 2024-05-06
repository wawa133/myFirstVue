import { render } from "../preset/vue.js";
export const bridgeData = {
    "workspaceFolder": "file:///e%3A/vueproject/vue-project",
    "serverRootDir": "",
    "previewFolderRelPath": "preview",
    "activeFileRelPath": "src/components/WelcomeItem.vue",
    "mapFileRelPath": "src/components/WelcomeItem.vue",
    "presetName": "vue",
    "workspaceFolderName": "vue-project"
};
export const preview = () => render(getMod);
const getMod = () => import("../../src/components/WelcomeItem.vue");