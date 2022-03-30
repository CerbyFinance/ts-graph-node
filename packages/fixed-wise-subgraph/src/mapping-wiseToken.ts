import {
  ZERO,
  ONE,
} from "./shared"
import {
  StakeStart,
  StakeEnd,
  InterestScraped,
} from "../generated/WiseToken/WiseToken"
import {
  Stake,
} from "../generated/schema"

export function handleStakeStart (event: StakeStart): void {
  let stake = new Stake(event.params.stakeID.toHexString())
  stake.staker = event.params.stakerAddress
  stake.referrer = event.params.referralAddress
  stake.principal = event.params.stakedAmount
  stake.shares = event.params.stakesShares
  stake.cmShares = event.params.referralShares
  stake.currentShares = event.params.stakesShares
  stake.startDay = event.params.startDay
  stake.lockDays = event.params.lockDays
  stake.daiEquivalent = event.params.daiEquivalent
  stake.reward = null
  stake.closeDay = null
  stake.penalty = null
  stake.scrapedYodas = ZERO
  stake.sharesPenalized = ZERO
  stake.referrerSharesPenalized = ZERO
  stake.scrapeCount = ZERO
  stake.lastScrapeDay = null
  stake.timestamp = event.block.timestamp;
  stake.startTx = event.transaction.hash;
  stake.endTx = null;
  stake.save()
}

export function handleStakeEnd (event: StakeEnd): void {
  let stake = Stake.load(event.params.stakeID.toHexString())
  if(!stake) {
    stake = new Stake(event.params.stakeID.toHexString())
    stake.startDay = ZERO
    stake.lockDays = ZERO
    stake.daiEquivalent = ZERO
    stake.reward = null
    stake.closeDay = null
    stake.penalty = null
    stake.scrapedYodas = ZERO
    stake.sharesPenalized = ZERO
    stake.referrerSharesPenalized = ZERO
    stake.scrapeCount = ZERO
    stake.lastScrapeDay = null
    stake.timestamp = event.block.timestamp;
    stake.startTx = null
  }
  stake.endTx = event.transaction.hash;
  stake.staker = event.params.stakerAddress
  stake.referrer = event.params.referralAddress
  stake.principal = event.params.stakedAmount
  stake.shares = event.params.stakesShares
  stake.cmShares = event.params.referralShares
  stake.currentShares = event.params.stakesShares
  stake.closeDay = event.params.closeDay
  stake.penalty = event.params.penaltyAmount
  stake.reward = event.params.rewardAmount
  stake.timestamp = event.block.timestamp;
  stake.save()
}

export function handleInterestScraped (event: InterestScraped): void {
  let stake = Stake.load(event.params.stakeID.toHexString())
  if(stake) {
    stake.scrapeCount = stake.scrapeCount.plus(ONE)
    stake.lastScrapeDay = event.params.scrapeDay
    stake.scrapedYodas = stake.scrapedYodas.plus(event.params.scrapeAmount)
    stake.currentShares = stake.currentShares.minus(event.params.stakersPenalty)
    stake.sharesPenalized = stake.sharesPenalized.plus(event.params.stakersPenalty)
    stake.referrerSharesPenalized = stake.referrerSharesPenalized.plus(event.params.referrerPenalty)
    stake.save()
  }
}
