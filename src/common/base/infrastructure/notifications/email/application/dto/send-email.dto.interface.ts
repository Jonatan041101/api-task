import { Subject } from "../enum/subject";

export interface ISendMailDto {
  to: string;
  subject: Subject;
  pathHtml: string;
  text:string
}
