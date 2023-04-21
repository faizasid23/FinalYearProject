import React, { useEffect, useState } from "react";
import {
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    IconButton,
    Alert,
    TextField,
    InputAdornment,
    CircularProgress
} from "@mui/material";
import { withStyles } from "@mui/styles";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SearchIcon from "@mui/icons-material/Search";
import RoundedButton from "../../../../components/RoundedButton";
import { getStudentById, selectStudent } from "../../../../apis/manager";

function AddStudentModal(props) {
    let { id, classes, handleClose } = props;

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState(null);

    useEffect(() => {
        const handleInputSearch = setTimeout(() => {
            if (search !== '') {
                setIsLoading(true)
                getStudentById(search).then((result) => {
                    if (result.status === "success") {
                        setIsLoading(false)
                        setSearchResult(result?.data ?? "")
                    } else {
                        setIsLoading(false);
                        setSubmitMessage({
                            status: "error",
                            message: result.message ?? "Error has occured",
                        });
                    }
                });
            }
        }, 500);

        return () => clearTimeout(handleInputSearch)
    }, [search])

    const handleSubmit = () => {
        if (!selectedStudent?._id) {
            setSubmitMessage({
                status: "error",
                message: "You haven't selected any student.",
            });
        }
        else {
            setIsSubmitting(true);

            let params = {
                student_id: selectedStudent._id,
                manager_id: id
            };

            selectStudent(params).then((result) => {
                if (result.status === "success") {
                    setIsSubmitting(false);
                    props.handleSubmit();
                } else {
                    setIsSubmitting(false);
                    setSubmitMessage({
                        status: "error",
                        message: result.message ?? "Error has occured",
                    });
                }
            });
        }
    };

    const handleStudentSelection = () => {
        setSearch('')
        setSelectedStudent(searchResult)
    }

    const renderStudentInfoRow = () => {
        return (
            <Grid container className={classes.infoTable}>
                <Grid container>
                    <Grid item md={4}>
                        <Typography class="h">MUDID</Typography>
                    </Grid>
                    <Grid item md={4}>
                        <Typography class="h">NAME</Typography>
                    </Grid>
                    <Grid item md={4}>
                        <Typography class="h">EMAIL</Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.infoRow} onClick={handleStudentSelection}>
                    <Grid item md={4}>
                        <Typography>{searchResult?.mudid}</Typography>
                    </Grid>
                    <Grid item md={4}>
                        <Typography>{searchResult?.name}</Typography>
                    </Grid>
                    <Grid item md={4}>
                        <Typography>{searchResult?.email}</Typography>
                    </Grid>
                </Grid>
            </Grid >
        )
    }

    return (
        <Dialog open={true} classes={{ paper: classes.root }} onClose={handleClose}>
            <DialogTitle className={classes.head}>
                <div className={classes.headInner}>
                    <Typography>
                        Search A Student
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CancelOutlinedIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent classes={{ root: classes.body }}>
                <Grid container class={classes.container}>
                    <Grid item md={12} >
                        <TextField
                            required
                            fullWidth
                            variant="outlined"
                            name="search"
                            placeholder="Search by MUDID..."
                            tabIndex={1}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" variant="filled" tabIndex={-1}>
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    {search &&
                        <Grid item md={12} className={classes.searchPaper}>
                            {isLoading ?
                                <CircularProgress style={{ color: "#F36633", height: "2.5rem", width: "2.5rem", margin: 'auto' }} />
                                : searchResult?.name ?
                                    renderStudentInfoRow()
                                    : <Typography style={{ margin: 'auto' }}>No Student Found with this MUDID</Typography>
                            }
                        </Grid>
                    }

                    <div className={classes.rowItem}>
                        <div className={classes.grayedBox}>
                            <Typography>Name:</Typography>
                            <Typography>{selectedStudent?.name ?? "Not Selected"}</Typography>
                        </div>

                        <div xs={12} item className={classes.grayedBox}>
                            <Typography>Email:</Typography>
                            <Typography>{selectedStudent?.email ?? "Not Selected"}</Typography>
                        </div>
                    </div>
                </Grid>
                {submitMessage && (
                    <div className={classes.row}>
                        <Alert
                            className={classes.submitMessage}
                            variant="standard"
                            severity={submitMessage.status}
                            onClose={() => setSubmitMessage(null)}
                        >
                            {submitMessage.message}
                        </Alert>
                    </div>
                )}

                {/* Footer */}
                <div className={classes.footer}>
                    <RoundedButton
                        handleSubmit={handleClose}
                        color="dark"
                        square={true}
                    >
                        Close
                    </RoundedButton>
                    <RoundedButton
                        isLoading={isSubmitting}
                        handleSubmit={handleSubmit}
                        square={true}
                        type="submit"
                    >
                        Add
                    </RoundedButton>
                </div>
            </DialogContent>
        </Dialog >
    );
}

const materialStyles = (theme) => ({
    root: { width: 560 },
    head: {
        paddingTop: "1rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #DEE2E6",
        "& p": {
            fontSize: "1.5rem",
            fontWeight: 500,
            color: theme.palette.primary.main,
        },
    },
    headInner: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    body: { paddingTop: "1rem" },
    container: {
        padding: "1.5rem 0rem",
        "& .MuiTextField-root": { width: "100%" },
        "& > *": {
            padding: "0.75rem 0rem"
        },
        "& .MuiTextField-root > .MuiFormHelperText-root": {
            marginLeft: 2, marginRight: 0
        }
    },
    row: { marginBottom: "1rem" },
    rowItem: {
        display: 'flex',
        "& :nth-child(1)": { marginRight: "1rem" }
    },
    grayedBox: {
        width: '50%',
        borderRadius: '4px',
        backgroundColor: '#DFDDDD',
        display: 'flex',
        padding: '1rem',
        alignItems: 'center'
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        "& > *": { width: "45%" }
    },
    searchPaper: {
        backgroundColor: '#FFF',
        boxShadow: "0px 2px 8px 3px rgba(0,0,0,0.2)",
        position: "absolute",
        width: '92%',
        minHeight: '8rem',
        display: 'flex'
    },
    infoTable: {
        textAlign: 'center',
        "& p": {
            margin: 0,
            fontSize: '0.875rem'
        },
        "& > :nth-child(1)": {
            borderBottom: '1px solid lightgray',
            alignContent: 'center',
            "& .h": { fontWeight: 500 }
        }
    },
    infoRow: {
        alignContent: 'center',
        cursor: 'pointer',
        overflow: 'auto',
        "&:hover": {
            backgroundColor: 'lightgray'
        }
    }
});

export default withStyles(materialStyles)(AddStudentModal);