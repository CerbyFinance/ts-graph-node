import {
  BulkMarkedAsBot,
  MarkedAsBot,
  MarkedAsHuman,
} from "../generated/deft/DeftStorage";
import { Bot, Human } from "../generated/schema";

let ZERO = "0x0";
let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
// prettier-ignore
let ZERO_ADDRESS_2 = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function handleMarkedAsHuman(event: MarkedAsHuman): void {
  let addr = event.params.addr.toHexString();
  let human = new Human(addr);
  human.save();
}

export function handleMarkedAsBot(event: MarkedAsBot): void {
  let addr = event.params.addr.toHexString();
  let bot = new Bot(addr);
  bot.save();
}

export function handleBulkMarkedAsBot(event: BulkMarkedAsBot): void {
  let addrs = event.params.addrs;

  for (let i = 0; i < addrs.length; i++) {
    let addr = addrs[i].toHexString();

    if (addr == ZERO || addr == ZERO_ADDRESS || addr == ZERO_ADDRESS_2) {
      continue;
    }

    let bot = new Bot(addr);
    bot.save();
  }
}
