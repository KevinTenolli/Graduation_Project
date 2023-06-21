import SideNav, {
  Toggle,
  NavItem,
  NavText,
  Nav,
  NavIcon,
} from "@trendmicro/react-sidenav";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { useNavigate } from "react-router-dom";
function MainSideNav({ isAdmin, account }) {
  const navigate = useNavigate();
  return (
    <SideNav
      onSelect={(selected) => {
        navigate("/" + selected);
      }}
      style={{ backgroundColor: "#88038a" }}
    >
      <Toggle />

      <Nav defaultSelected="">
        <NavItem eventKey="result">
          <NavIcon style={{ padding: "2%" }}>
            <ContactsOutlinedIcon />
          </NavIcon>
          <NavText>Result</NavText>
        </NavItem>
        {isAdmin && (
          <NavItem eventKey="admin/candidate">
            <NavIcon style={{ padding: "2%" }}>
              <PeopleAltOutlinedIcon />
            </NavIcon>
            <NavText>Candidate</NavText>
          </NavItem>
        )}
        {isAdmin && (
          <NavItem eventKey="admin/election">
            <NavIcon style={{ padding: "2%" }}>
              <BadgeOutlinedIcon />
            </NavIcon>
            <NavText>Election</NavText>
          </NavItem>
        )}
        {isAdmin && (
          <NavItem eventKey="admin/registerVoter">
            <NavIcon style={{ padding: "2%" }}>
              <PersonAddAltOutlinedIcon />
            </NavIcon>
            <NavText>Voter</NavText>
          </NavItem>
        )}

        {!isAdmin && account && (
          <NavItem eventKey="voter/vote">
            <NavIcon style={{ padding: "2%" }}>
              <AccountCircleOutlinedIcon />
            </NavIcon>
            <NavText>Vote</NavText>
          </NavItem>
        )}
      </Nav>
    </SideNav>
  );
}

export default MainSideNav;
