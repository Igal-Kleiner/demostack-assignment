import { getUniqueId } from "../utils/shared"

class LoopItem {
  id: string
  path: string

  constructor(path: string) {
    this.id = getUniqueId()
    this.path = path
  }
}

export default LoopItem