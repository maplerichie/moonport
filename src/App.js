import { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import Web3Modal from "web3modal";
import { Web3Provider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from 'ethers';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import AppsIcon from '@material-ui/icons/Apps';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import logo from './moonbeam_logo.png';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { MOONBEAM_TYPES, MOONBEAM_RPC, MOONBEAM_NETWORK, MOONBEAM_CHAIN_ID, STAKING_ABI, STAKING_ADDRESS, DP } from './constants';
import Blockies from 'react-blockies';
import useExternalContractLoader from './hooks/ExternalContract';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  table: {
    minWidth: 650,
  },
  subTable: {
    borderRadius: 16,
    backgroundColor: '#313131',
  },
  address: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 150,
    alignSelf: "flex-end",
  },
  stakeForm: {
    marginTop: 8,
    marginBottom: 8,
  },
}));


function Row(props) {
  const classes = useStyles();
  const { index, row, stake, unstake, me } = props;
  const [openModal, setOpenModal] = useState(false);

  return (
    <Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          {index + 1}
        </TableCell>
        <TableCell align="left">
          <Box display="flex" style={{ color: row.stakedAmount ? '#EA5AA2' : 'inherit' }}>
            <Blockies seed={row.owner} size={10} scale={3} />
            &nbsp;&nbsp;&nbsp;{row.owner}
          </Box>
        </TableCell>
        <TableCell align="left">{row.awardedPts}</TableCell>
        <TableCell align="left">{row.atStake.nominators.length}</TableCell>
        <TableCell align="right" color="primary">{row.amount}</TableCell>
        <TableCell align="center">
          <IconButton aria-label="row" size="small" onClick={() => setOpenModal(!openModal)}>
            {openModal ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openModal} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Box display="flex" align="center" justifyContent="space-between">
                <Typography variant="h6" gutterBottom component="div">Snapshot</Typography>
                <Box display="flex">
                  {row.stakedAmount === 0 ? <div/> : <Button variant="contained" color="primary" onClick={(event) => unstake(event, row.owner)}>Unstake</Button>}
                  <div style={{ width: 16 }} />
                  <Button variant="contained" color="secondary" onClick={(event) => stake(event, row.owner, row.stakedAmount)}>Stake</Button>
                </Box>
              </Box>
              <div style={{ height: "16px" }} />
              <TableContainer className={classes.subTable}>
                <Table aria-label="collator-table">
                  <TableBody>
                    <TableRow>
                      <TableCell variant="head" >
                        Bond
                      </TableCell>
                      <TableCell align="right" colSpan={3}>{row.atStake.bond}</TableCell>
                    </TableRow>
                    {
                      row.atStake.nominators.map((nRow, nIndex) => (
                        <TableRow>
                          {nIndex === 0 ?
                            <TableCell variant="head" >
                              Nominators
                            </TableCell> :
                            <TableCell />
                          }
                          <TableCell style={{ color: me.toLowerCase() === nRow.owner.toLowerCase() ? '#EA5AA2' : 'inherit' }}>
                            #{nIndex + 1}
                          </TableCell>
                          <TableCell align="left" style={{ color: me.toLowerCase() === nRow.owner.toLowerCase() ? '#EA5AA2' : 'inherit' }}>{nRow.owner}</TableCell>
                          <TableCell align="right" style={{ color: me.toLowerCase() === nRow.owner.toLowerCase() ? '#EA5AA2' : 'inherit' }}>{nRow.amount}</TableCell>
                        </TableRow>
                      ))}
                    <TableRow>
                      <TableCell variant="head" colSpan={3} align="right">
                        Total
                      </TableCell>
                      <TableCell align="right">{row.atStake.total}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

const web3Modal = new Web3Modal({
  theme: "dark",
  network: {
    name: "Moonbeam Alpha",
    color: "#53CBC9",
    chainId: 1287,
    rpcUrl: "https://rpc.testnet.moonbeam.network",
    blockExplorer: "https://moonbeam-explorer.netlify.app/",
    // name: "Moonbeam Dev",
    // chainId: 1281,
    // rpcUrl: "http://127.0.0.1:9933",
  },
  cacheProvider: true,
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function App() {
  const classes = useStyles();

  const [networkModal, setNetworkModal] = useState(false);
  const [stakeModal, setStakeModal] = useState({
    open: false,
    isLoading: false,
    isSuccess: false,
    isFailed: false,
  });
  const [stakeAddress, setStakeAddress] = useState(null);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [modalStyle] = useState(getModalStyle);

  const [injectedProvider, setInjectedProvider] = useState();
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [balance, setBalance] = useState('0');

  const [pApi, setApi] = useState(null);
  const [dashboard, setDashboard] = useState({
    roundInfo: {},
    rewardPoint: 0,
    totalLocked: 0,
    totalSelected: 0,
    commission: null,
  });
  const [candidates, setCandidates] = useState([]);

  const provider = new StaticJsonRpcProvider(MOONBEAM_NETWORK, {
    chainId: MOONBEAM_CHAIN_ID,
    name: 'MOONBEAM ALPHA'
  });

  const moonbaseAlphaStakingContract = useExternalContractLoader(provider, STAKING_ADDRESS, STAKING_ABI);

  const signer = useMemo(() => (injectedProvider?.getSigner()), [injectedProvider]);

  const contractWithSigner = useMemo(() => (moonbaseAlphaStakingContract ? moonbaseAlphaStakingContract.connect(signer) : moonbaseAlphaStakingContract), [
    moonbaseAlphaStakingContract,
    signer,
  ]);

  useEffect(() => {
    async function fetchData() {
      const wsProvider = new WsProvider(MOONBEAM_RPC);
      const pApi = await ApiPromise.create({
        provider: wsProvider,
        types: MOONBEAM_TYPES,
      });
      setApi(pApi);
      console.log('setApi');
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!pApi) {
      return;
    }
    async function fetchData() {
      const roundRes = await pApi.query.parachainStaking.round();
      const pointRes = await pApi.query.parachainStaking.points(roundRes.toJSON().current);

      const lockedRes = await pApi.query.parachainStaking.total();

      const selectedRes = await pApi.query.parachainStaking.totalSelected();

      const commissionRes = await pApi.query.parachainStaking.collatorCommission();

      setDashboard({
        roundInfo: roundRes.toJSON(),
        rewardPoint: pointRes.toHuman(),
        totalLocked: lockedRes.toHuman(),
        totalSelected: selectedRes.toHuman(),
        commission: commissionRes.toHuman(),
      });
      console.log('setDashboard');
    }
    fetchData();
  }, [pApi]);

  useEffect(() => {
    if (!pApi) {
      return;
    }
    if (dashboard.roundInfo.current === undefined) {
      return;
    }
    if (!connectedAddress) {
      return;
    }
    async function fetchData() {
      var tempArr = [];
      var candidates = await pApi.query.parachainStaking.candidatePool();
      var nominatorState = await pApi.query.parachainStaking.nominatorState(connectedAddress);

      for (var row of candidates.toHuman()) {
        var candidate = row;
        candidate.stakedAmount = 0;
        for (var nRow of nominatorState.toHuman().nominations) {
          if (nRow.owner === row.owner) {
            candidate.stakedAmount = nRow.amount;
            break;
          }
        }
        var atStake = await pApi.query.parachainStaking.atStake(dashboard.roundInfo.current, row.owner);
        candidate.atStake = atStake.toHuman();

        var awardedPts = await pApi.query.parachainStaking.awardedPts(dashboard.roundInfo.current, row.owner);
        candidate.awardedPts = awardedPts.toHuman();

        tempArr.push(candidate);
      }
      setCandidates(tempArr);
      console.log('setCandidates');
    }
    fetchData();
  }, [pApi, dashboard.roundInfo, connectedAddress]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    if (parseInt(provider.chainId) !== MOONBEAM_CHAIN_ID) {
      await web3Modal.clearCachedProvider();
      setNetworkModal(true);
    } else {
      setConnectedAddress(provider.selectedAddress);
      setInjectedProvider(new Web3Provider(provider));

      const balance = await new Web3Provider(provider).getBalance(provider.selectedAddress);
      setBalance(ethers.utils.formatEther(balance, { commify: true }));
    }
  }, []);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const handleNetworkModal = () => {
    setNetworkModal(false);
  };

  const stakeCandidate = (event, address, stakedAmount) => {
    setStakeAddress(address);
    setStakeAmount(0);
    setStakedAmount(stakedAmount);
    setStakeModal({ open: true });
  };

  const unstakeCandidate = (event, address) => {
    contractWithSigner.revoke_nomination(address).then((res) => {
      console.log('Unstake success');
    }).catch((err) => {
      console.log('Unstake failed');
    });
  };

  const handleStakeModal = () => {
    setStakeModal({ open: false });
  };

  const submitStake = () => {
    setStakeModal({ open: true, isLoading: true });
    contractWithSigner.nominate(stakeAddress, (stakeAmount * DP).toString()).then((res) => {
      setStakeAmount(0);
      setStakeModal({ isLoading: false, isSuccess: true, open: true })
      console.log('Stake success');
    }).catch((err) => {
      setStakeModal({ isLoading: false, isFailed: true, open: true })
      console.log('Stake failed');
    });
  }

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <img src={logo} className={classes.toolbar} alt="logo" />
        <Divider />
        <List>
          <ListItem button key="dApp">
            <ListItemIcon><AppsIcon color="primary" /></ListItemIcon>
            <ListItemText primary="dApp" />
          </ListItem>
          <ListItem button key="Staking">
            <ListItemIcon><InboxIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Staking" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <Modal
          open={networkModal}
          onClose={handleNetworkModal}
          aria-labelledby="network-modal-title"
          aria-describedby="network-modal-description"
        >
          <div style={modalStyle} className={classes.modal}>
            <Typography variant="h4" color="primary">
              Please switch to Moonbase Alpha TestNet.
            </Typography>
            <Typography paragraph>
              Network Name: Moonbase Alpha<br />
              New RPC URL: https://rpc.testnet.moonbeam.network<br />
              ChainID: 1287<br />
              Symbol (Optional): DEV<br /><br />
              <a style={{ color: "#fff" }} href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-custom-Network-RPC-and-or-Block-Explorer">How to add custom Network RPC, and / or Block Explorer
              </a>
            </Typography>
          </div>
        </Modal>
        <Modal
          open={stakeModal.open}
          onClose={handleStakeModal}
          aria-labelledby="stake-modal-title"
          aria-describedby="stake-modal-description"
        >
          <div style={modalStyle} className={classes.modal}>
            <img src="logo192.png" alt="moonbeam" style={{ width: 64 }} />
            <Divider />
            {stakeModal.isLoading ?
              <Box align="center" style={{ paddingTop: 16 }}>
                <CircularProgress />
              </Box> :
              <div>
                <Typography style={{ paddingTop: 8, paddingBottom: 8 }} color="textPrimary">
                  Stake to&nbsp;
                  <Typography color="primary" component="span">{stakeAddress}</Typography>
                </Typography>
                <Typography color="textPrimary">
                  Available balance:&nbsp;<Typography variant="h6" component="span">{balance}</Typography>&nbsp;DEV
                </Typography>
                <Typography color="textPrimary">
                  Total staked:&nbsp;<Typography variant="h6" component="span" color="primary">{stakedAmount}</Typography>
                </Typography>
                <Typography variant="caption">
                  * Minimum 5 DEV
                </Typography>
                <Box display="flex" style={{ justifyContent: 'space-between', alignItems: "center" }}>
                  <form className={classes.stakeForm} noValidate autoComplete="off">
                    <TextField placeholder="Amount" variant="outlined" color="secondary" type="number" inputProps={{ min: 0 }}
                      value={stakeAmount}
                      onInput={e => setStakeAmount(e.target.value)} />
                  </form>
                  <Button variant="contained" color="secondary" onClick={submitStake}>Stake</Button>
                </Box>
              </div>}
          </div>
        </Modal>
        <Box display="flex" alignItems="center" justifyContent="flex-end" style={{ paddingBottom: "16px" }}>
          {
            injectedProvider ?
              <Box display="flex">
                <Box display="flex" flexDirection="column">
                  <Typography className={classes.address}>{connectedAddress}</Typography>
                  <Typography variant="caption">Balance: {balance} DEV</Typography>
                </Box>
                <div style={{ width: "16px" }} />
              </Box> : <div />
          }
          <Button variant="outlined" color="primary" onClick={() => {
            if (!injectedProvider) {
              loadWeb3Modal();
            } else {
              logoutOfWeb3Modal();
            }
          }}>{!injectedProvider ? "Connect Wallet" : "Disconnect"}</Button>
        </Box>
        <Typography variant="h5" gutterBottom>
          Staking
        </Typography>
        <Grid container justify="space-between">
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Round
                </Typography>
                <Typography align="right">
                  #{dashboard.roundInfo.current | 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Reward Point
                </Typography>
                <Typography align="right">
                  {dashboard.rewardPoint}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Commission
                </Typography>
                <Typography align="right">
                  {dashboard.commission}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Total capital locked
                </Typography>
                <Typography align="right">
                  {dashboard.totalLocked}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Selected candidates
                </Typography>
                <Typography align="right">
                  {dashboard.totalSelected}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Typography variant="h6">
          Pool
        </Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">#</TableCell>
                <TableCell align="left">Candidate</TableCell>
                <TableCell align="left">Reward Points</TableCell>
                <TableCell align="left">Nominators</TableCell>
                <TableCell align="right">Total Stake</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates.length > 0 ? candidates.map((row, index) => (
                <Row key={index} index={index} row={row} stake={stakeCandidate} unstake={unstakeCandidate} me={connectedAddress} />
              )) :
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </div>
  );
}

export default App;
