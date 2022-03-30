import {
  CachedInterestPerShare,
  DailySnapshot,
  MaxSharePrice,
  Stake,
  User,
} from "../generated/schema";
import {
  CachedInterestPerShareSealed,
  DailySnapshotSealed,
  NewMaxSharePriceReached,
  StakeEnded,
  StakeOwnerChanged,
  StakeStarted,
  StakeUpdated,
} from "../generated/Staking/Staking";
import { BI_18, convertTokenToDecimal, ZERO_BD, ZERO_BI } from "./helpers";

function getOrCreateUser(id: string): User | null {
  let user = User.load(id);
  if (user == null) {
    user = new User(id);
    user.stakedAmount = ZERO_BD;
    user.save();
  }
  return user;
}

export function handleStakeStarted(event: StakeStarted): void {
  let ownerId = event.params.owner.toHexString();

  let stakedAmount = convertTokenToDecimal(event.params.stakedAmount, BI_18);

  let stakeId = event.params.stakeId.toString();

  let isPresent = Stake.load(stakeId);
  if (isPresent) {
    return;
  }

  let stake = new Stake(stakeId);
  stake.owner = ownerId;
  stake.stakedAmount = stakedAmount;
  stake.startDay = event.params.startDay;
  stake.lockDays = event.params.lockedForXDays;
  stake.endDay = ZERO_BI;
  stake.interest = ZERO_BD;
  stake.penalty = ZERO_BD;
  stake.sharesCount = convertTokenToDecimal(event.params.sharesCount, BI_18);
  stake.startedAt = event.block.timestamp;
  stake.completedAt = null;
  stake.canceledAt = null;
  stake.startTx = event.transaction.hash;
  stake.endTx = null;
  stake.timestamp = event.block.timestamp;
  stake.blockNumber = event.block.number;
  stake.gasPrice = event.transaction.gasPrice;
  stake.gasUsed = event.transaction.gasUsed;
  stake.save();

  let owner = getOrCreateUser(ownerId);
  owner.stakedAmount = owner.stakedAmount.plus(stakedAmount);
  owner.save();
}

export function handleStakeEnded(event: StakeEnded): void {
  let stakeId = event.params.stakeId.toString();
  let isPresent = Stake.load(stakeId);
  if (!isPresent) {
    return;
  }

  let stake = Stake.load(event.params.stakeId.toString());

  // reentrance v2
  if (stake.endTx) {
    return;
  }

  let ownerId = stake.owner;
  let stakedAmount = stake.stakedAmount;

  stake.endDay = event.params.endDay;
  stake.penalty = convertTokenToDecimal(event.params.penalty, BI_18);
  if (stake.penalty == ZERO_BD) {
    stake.completedAt = event.block.timestamp;
  } else {
    stake.canceledAt = event.block.timestamp;
  }
  stake.endTx = event.transaction.hash;
  stake.interest = convertTokenToDecimal(event.params.interest, BI_18);
  stake.save();

  let owner = getOrCreateUser(ownerId);
  owner.stakedAmount = owner.stakedAmount.minus(stakedAmount);
  owner.save();
}

export function handleStakeOwnerChanged(event: StakeOwnerChanged): void {
  let newOwnerId = event.params.newOwner.toHexString();
  let newOwner = getOrCreateUser(newOwnerId);

  let stakeId = event.params.stakeId.toString();
  let stake = Stake.load(stakeId);

  let oldOwnerId = stake.owner;
  let stakedAmount = stake.stakedAmount;
  stake.owner = newOwnerId;
  stake.save();

  let oldOwner = getOrCreateUser(oldOwnerId);
  oldOwner.stakedAmount = oldOwner.stakedAmount.minus(stakedAmount);
  newOwner.stakedAmount = newOwner.stakedAmount.plus(stakedAmount);

  oldOwner.save();
  newOwner.save();
}

export function handleStakeUpdated(event: StakeUpdated): void {
  let stake = Stake.load(event.params.stakeId.toString());

  stake.sharesCount = convertTokenToDecimal(event.params.sharesCount, BI_18);
  stake.lockDays = event.params.lockedForXDays;
  stake.save();
}

export function handleNewMaxSharePriceReached(
  event: NewMaxSharePriceReached,
): void {
  let share = MaxSharePrice.load("0");
  if (share == null) {
    share = new MaxSharePrice("0");
  }
  share.sharePrice = convertTokenToDecimal(event.params.newSharePrice, BI_18);
  share.save();
}

export function handleCachedInterestPerShareSealed(
  event: CachedInterestPerShareSealed,
): void {
  let sealedDay = event.params.sealedDay;
  let cachedInterestPerShare = event.params.cachedInterestPerShare;
  let sealedCachedDay = event.params.sealedCachedDay;

  let entity = new CachedInterestPerShare(sealedCachedDay.toString());
  entity.sealedDay = sealedDay;
  entity.sealedCachedDay = sealedCachedDay;
  entity.cachedInterestPerShare = convertTokenToDecimal(
    cachedInterestPerShare,
    BI_18,
  );

  entity.save();
}

export function handleDailySnapshotSealed(event: DailySnapshotSealed): void {
  let sealedDay = event.params.sealedDay;
  let inflationAmount = event.params.inflationAmount;
  let totalShares = event.params.totalShares;
  let sharePrice = event.params.sharePrice;
  let totalStaked = event.params.totalStaked;
  let totalSupply = event.params.totalSupply;

  let entity = new DailySnapshot(sealedDay.toString());
  entity.sealedDay = sealedDay;
  entity.inflationAmount = convertTokenToDecimal(inflationAmount, BI_18);
  entity.totalShares = convertTokenToDecimal(totalShares, BI_18);
  entity.sharePrice = convertTokenToDecimal(sharePrice, BI_18);
  entity.totalStaked = convertTokenToDecimal(totalStaked, BI_18);
  entity.totalSupply = convertTokenToDecimal(totalSupply, BI_18);

  entity.save();
}
