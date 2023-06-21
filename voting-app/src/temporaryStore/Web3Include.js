const adminAccount = "0xBf589C7517566D941C2E014fc1a764F11De9F2dc"; //admin account address, change according to the address that deployed the contract
const [Loader, setLoader] = useState(true);
const [electionContract, setElectionContract] = useState(null);
const [account, setAccount] = useState(null);
const navigate = useNavigate();

useEffect(() => {
  const loadWeb3 = async () => {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadBlockchainData = async () => {
    try {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      setAccount(account);
      const networkId = await web3.eth.net.getId();
      const electionData = VotingSystem.networks[networkId];
      if (electionData) {
        setLoader(false);
        const election = new web3.eth.Contract(
          VotingSystem.abi,
          electionData.address
        );
        setElectionContract(election);
        if (account === adminAccount) {
          navigate("/admin");
        } else if (account) {
          navigate("/voter");
        }
      } else {
        alert("wallet not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  loadWeb3();
  loadBlockchainData();
}, []);
