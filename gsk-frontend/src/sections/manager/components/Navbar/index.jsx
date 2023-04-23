import clsx from 'clsx';
import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
// importing material UI stuff
import { Avatar, Box, ButtonBase, ClickAwayListener, Fade, Paper, Popper, Tooltip, Typography } from '@mui/material';
import { withStyles } from "@mui/styles";
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
// importing logo for the nav bar
import Logo from '../../../../assets/images/GSK_logo.png';
import { managerUrls } from '../../../../utils/urls';
// redux stuff
import { clearUser } from "../../../../redux/ActionCreators";
import { withRouter } from '../../../../utils/router';
import { MENU } from './menu';

export const Index = (props) => {
    let { classes, user } = props;

    const profileButtonRef = useRef(null);
    const navigate = useNavigate();
    const [showProfileBox, setShowProfileBox] = useState(false);

    const handleLink = (e, link) => {
        e.preventDefault();
        navigate(link);
        setShowProfileBox(false);
    };

    const handleLogout = async () => {
        props.clearUser();

        await localStorage.clear();
        navigate("/login");
    };

    const renderProfileBox = () => {
        return (
            <Popper
                className={classes.navDropdown}
                open={showProfileBox}
                placement="bottom-end"
                anchorEl={profileButtonRef.current}
                transition
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                        <Paper
                            style={{ width: "260px" }}
                            className={classes.navDropDownPaper}
                        >
                            <ClickAwayListener
                                disableReactTree={showProfileBox}
                                onClickAway={() => setShowProfileBox(prevCheck => !prevCheck)}
                            >
                                <Box>
                                    <Box className={classes.profilePopperTop}>
                                        {/* <ButtonBase
                                            disableRipple
                                            class={classes.profilePopperButton}
                                            style={{ marginBottom: 10 }}
                                            onClick={(e) => handleLink(e, managerUrls.Profile)}
                                        >
                                            <PersonOutlineIcon style={{ marginRight: 10 }} />
                                            <Typography className={classes.link}>
                                                Profile
                                            </Typography>
                                        </ButtonBase> */}
                                        <ButtonBase
                                            disableRipple
                                            class={classes.profilePopperButton}
                                            style={{ marginBottom: 10 }}
                                            onClick={(e) => handleLink(e, managerUrls.Settings)}
                                        >
                                            <SettingsOutlinedIcon style={{ marginRight: 10 }} />
                                            <Typography className={classes.link}>
                                                Settings
                                            </Typography>
                                        </ButtonBase>
                                    </Box>
                                    <Box className={classes.profilePopperFooter}>
                                        <ButtonBase
                                            disableRipple
                                            class={classes.profilePopperButton}
                                        >
                                            <LogoutOutlinedIcon
                                                color="secondary"
                                                style={{ marginRight: 10 }}
                                            />
                                            <Typography color="secondary" onClick={handleLogout}>
                                                Log out
                                            </Typography>
                                        </ButtonBase>
                                    </Box>
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )
                }
            </Popper >
        );
    };

    const renderTopBar = () => (
        <>
            <div className={classes.container}>
                <div className={classes.rightFlex}>
                    {/* User Profile Box */}
                    <div
                        className={clsx(classes.profileBox, classes.textBox)}
                    >
                        <Typography>Hello {user?.user?.first_name ?? "User"}</Typography>
                    </div>
                    <div
                        className={clsx(classes.profileBox, classes.borderLeftGrey)}
                        ref={profileButtonRef}
                        onClick={() => setShowProfileBox(true)}
                    >
                        <Tooltip
                            classes={{
                                tooltip: classes.tooltip,
                                arrow: classes.arrow,
                            }}
                            title={user?.user?.name ?? "User"}
                            arrow
                        >
                            <Avatar />
                        </Tooltip>
                    </div>
                </div>
            </div>
            {renderProfileBox()}
        </>
    );

    const renderSideBar = () => (
        <div className={classes.SideBarContainer}>
            <div className={classes.SideBarLayout}>
                <div className={classes.logoContainer}>
                    <Link
                        style={{ height: "3.82rem", cursor: 'pointer' }}
                        onClick={(e) => handleLink(e, managerUrls.Dashboard)}
                    >
                        <img
                            alt="GSK Logo"
                            className={classes.logo}
                            src={Logo}
                        />
                    </Link>
                </div>
                {MENU &&
                    MENU.map((item, index) => (
                        <ButtonBase
                            key={index}
                            disableRipple
                            class={clsx(
                                classes.menuItem,
                                item.query ? item.url.includes(props.location.pathname) && classes.active
                                    : props.location.pathname.indexOf(item.url) !== -1 &&
                                    classes.active
                            )}
                            onClick={(e) => handleLink(e, item.url)}

                        >
                            {item.icon}
                            <Typography>{item.title}</Typography>
                        </ButtonBase>
                    ))}
            </div>
        </div>
    );

    return (
        <>
            {renderTopBar()}
            {renderSideBar()}
        </>
    )
}

const materialStyles = (theme) => ({
    arrow: {
        color: theme.palette.common.black,
    },
    tooltip: {
        backgroundColor: theme.palette.common.black,
        letterSpacing: "0.5px",
        fontSize: "0.8em",
    },
    container: {
        width: "82%",
        height: "5rem",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        position: 'fixed',
        zIndex: 999,
        borderBottom: '1px solid #e3e3e3',
        marginLeft: '18%'
    },
    logoContainer: {
        alignSelf: 'center', height: '7.5rem'
    },
    logo: {
        width: 160
    },
    rightFlex: {
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        height: "100%",
    },
    // Submenu Bar design
    SideBarContainer: {
        width: "18%",
        height: "100vh",
        position: 'fixed',
        // marginTop: "5rem",
        borderRight: '1px solid #e3e3e3',
        boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.1)",
        zIndex: 999,
        backgroundColor: '#fff'
    },
    SideBarLayout: {
        display: "flex",
        flexDirection: 'column'
    },
    menuItem: {
        display: "flex",
        fontSize: "1.12rem",
        height: "3.52rem",
        cursor: "pointer",
        border: 'none',
        marginBottom: ".125rem",
        padding: '0rem 1rem',
        alignItems: "center",
        color: theme.palette.secondary.main,
        backgroundColor: 'transparent',
        "& > :first-child": { marginRight: ".87rem" },
        "& svg:last-child": { marginLeft: ".87rem" },
        "&:hover": { backgroundColor: "#cfcdcdab" },
    },
    active: {
        backgroundColor: "#cfcdcdab",
        "& > p": { fontWeight: 500, color: 'black' },
        "&:hover": { cursor: 'default' },
    },
    profileBox: {
        display: "flex",
        cursor: "pointer",
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
        boxSizing: "border-box",
        width: "5rem",
        justifyContent: "center"
    },
    textBox: {
        width: '15rem', cursor: 'default',
        justifyContent: "flex-end",
        paddingRight: "1rem",
        "& p": { color: "darkslategray" }
    },
    borderLeftGrey: { borderLeft: "1px solid #ecedf5" },
    profilePopperTop: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 24,
        borderBottom: "1px solid #e0e0e0",
        paddingBottom: 4,
    },
    profilePopperButton: {
        display: "flex",
        flexDirection: "row",
        border: 'none',
        background: 'none',
        "&:hover": {
            color: theme.palette.primary.main,
            textDecoration: "inherit",
            cursor: "pointer",
        }
    },
    profilePopperFooter: {
        paddingLeft: 18,
        paddingTop: 12,
        paddingBottom: 12,
    },
    navDropdown: {
        borderTop: "1px solid #ecedf5",
        zIndex: 1000,
    },
    navDropDownPaper: {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        zIndex: 1000,
    },
    link: {
        color: "inherit ",
        textDecoration: "none",
        "& a": { color: "inherit", textDecoration: "inherit" },
    },
});

const mapStateToProps = (state) => ({ user: state.user, })

const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: () => dispatch(clearUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(materialStyles)(Index)));