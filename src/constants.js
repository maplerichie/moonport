
export const STAKING_ADDRESS = "0x0000000000000000000000000000000000000800";

export const STAKING_ABI = [
  "function is_nominator(address nominator) external view returns (bool)",

  "function is_candidate(address collator) external view returns (bool)",

  "function min_nomination() external view returns (uint256)",

  // Now the dispatchables

  "function join_candidates(uint256 amount) external",

  "function leave_candidates() external",

  "function go_offline() external",

  "function go_online() external",

  "function candidate_bond_more(uint256 more) external",

  "function candidate_bond_less(uint256 less) external",

  "function nominate(address collator, uint256 amount) external",

  "function leave_nominators() external",

  "function revoke_nomination(address collator) external",

  "function nominator_bond_more(address candidate, uint256 more) external",

  "function nominator_bond_less(address candidate, uint256 less) external",
];

// export const MOONBEAM_RPC = "ws://127.0.0.1:9944";
// export const MOONBEAM_CHAIN_ID = 1281;
export const MOONBEAM_NETWORK = "https://rpc.testnet.moonbeam.network";
export const MOONBEAM_RPC = "wss://wss.testnet.moonbeam.network";
export const MOONBEAM_CHAIN_ID = 1287;
export const DP = 10 ** 18;

export const MOONBEAM_TYPES = {
  AccountId: "EthereumAccountId",
  AccountId32: "H256",
  AccountInfo: "AccountInfoWithTripleRefCount",
  Address: "AccountId",
  AuthorId: "AccountId32",
  Balance: "u128",
  LookupSource: "AccountId",
  Account: {
    nonce: "U256",
    balance: "u128",
  },
  ExtrinsicSignature: "EthereumSignature",
  RoundIndex: "u32",
  Candidate: {
    id: "AccountId",
    fee: "Perbill",
    bond: "Balance",
    nominators: "Vec<Bond>",
    total: "Balance",
    state: "CollatorStatus",
  },
  Nominator: {
    nominations: "Vec<Bond>",
    total: "Balance",
  },
  Bond: {
    owner: "AccountId",
    amount: "Balance",
  },
  CollatorStatus: {
    _enum: ["Active", "Idle", { Leaving: "RoundIndex" }],
  },
  TxPoolResultContent: {
    pending: "HashMap<H160, HashMap<U256, PoolTransaction>>",
    queued: "HashMap<H160, HashMap<U256, PoolTransaction>>",
  },
  TxPoolResultInspect: {
    pending: "HashMap<H160, HashMap<U256, Summary>>",
    queued: "HashMap<H160, HashMap<U256, Summary>>",
  },
  TxPoolResultStatus: {
    pending: "U256",
    queued: "U256",
  },
  Summary: "Bytes",
  PoolTransaction: {
    hash: "H256",
    nonce: "U256",
    block_hash: "Option<H256>",
    block_number: "Option<U256>",
    from: "H160",
    to: "Option<H160>",
    value: "U256",
    gas_price: "U256",
    gas: "U256",
    input: "Bytes",
  },
  // Staking inflation
  Range: "RangeBalance",
  RangeBalance: {
    min: "Balance",
    ideal: "Balance",
    max: "Balance",
  },
  RangePerbill: {
    min: "Perbill",
    ideal: "Perbill",
    max: "Perbill",
  },
  InflationInfo: {
    expect: "RangeBalance",
    annual: "RangePerbill",
    round: "RangePerbill",
  },
  OrderedSet: "Vec<Bond>",
  Collator: {
    id: "AccountId",
    bond: "Balance",
    nominators: "Vec<Bond>",
    total: "Balance",
    state: "CollatorStatus",
  },
  CollatorSnapshot: {
    bond: "Balance",
    nominators: "Vec<Bond>",
    total: "Balance",
  },
  SystemInherentData: {
    validation_data: "PersistedValidationData",
    relay_chain_state: "StorageProof",
    downward_messages: "Vec<InboundDownwardMessage>",
    horizontal_messages: "BTreeMap<ParaId, Vec<InboundHrmpMessage>>",
  },
  RelayChainAccountId: "AccountId32",
  RoundInfo: {
    current: "RoundIndex",
    first: "BlockNumber",
    length: "u32",
  },
  RewardInfo: {
    total_reward: "Balance",
    claimed_reward: "Balance",
  },
  RegistrationInfo: {
    account: "AccountId",
    deposit: "Balance",
  },
  ParachainBondConfig: {
    account: "AccountId",
    percent: "Percent",
  },
};
