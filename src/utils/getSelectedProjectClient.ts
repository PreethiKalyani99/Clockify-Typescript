import { SelectedOption } from "../types/types";

export function getSelectedProjectAndClient(selectedProject: SelectedOption, selectedClient: SelectedOption){
    return `${selectedProject?.label}
    ${( selectedClient?.label && selectedProject?.value ) && ' - '}
    ${(selectedProject?.value) ? selectedClient?.label : ''}`
}