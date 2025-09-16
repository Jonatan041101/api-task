import { Base } from "@/common/base/domain/base.domain";

export class User extends Base {
  username: string;
  externalId?: string;
}
