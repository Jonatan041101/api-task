import { Base } from "@/common/base/domain/base.domain";

export class Task extends Base{
  title:string
  description:string
  isCompleted:boolean
}