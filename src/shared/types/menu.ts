import { IWidgetBtn } from "./widgets";

export type MenuLink = string;

export interface IMenuItem extends IWidgetBtn {
    link: MenuLink,
    dynamic?: boolean,
}
