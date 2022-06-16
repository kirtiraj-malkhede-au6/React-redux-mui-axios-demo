import React, { useEffect, useState } from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { fetchPost, postData, deletePost } from "../features/postSlice";
import { useSelector } from "react-redux";
import store from "../store/store";
import "./AllPost.css";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

const AllPost = () => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [closeAlert, setCloseAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();
  const { data, status } = useSelector((state) => {
    return state.post;
  });

  useEffect(() => {
    if (data.length === 0) {
      store.dispatch(fetchPost());
    }
  }, [data]);

  // Handlers
  const addPostHandler = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const postTitleHandler = (event) => {
    setTitle(event.target.value);
  };
  const postContentHandler = (event) => {
    setContent(event.target.value);
  };
  const editPostHandler = (id) => {
    navigate(`/${id}`);
  };
  const deleteHandler = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      console.log(response, response.data);
      if (response.status === 200 || 201) {
        setLoading(false);
      }
      store.dispatch(deletePost(id));
      setCloseAlert(true);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setRejected(true);
      setCloseAlert(true);
    }
  };

  let newPost = {
    userId: `A${Math.floor(Math.random() * 1000 + 1)}`,
    id: data.length + 1,
    title: title,
    body: content,
  };
  const postHandler = async () => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        newPost
      );
      console.log(response.data);
      store.dispatch(postData(response.data));
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <React.Fragment>
      <CssBaseline />

      <Container
        fixed
        sx={{
          px: "25%",
          py: "20px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => addPostHandler()}
          sx={{ width: "150px", fontSize: "18px" }}
        >
          Add Post
        </Button>
        <Box sx={{ display: "flex" }}>
          {loading === true ? <CircularProgress /> : ""}
        </Box>
        <Stack sx={{ width: "70%" }} spacing={2}>
          {closeAlert === true && rejected === true ? (
            <Alert
              variant="outlined"
              severity="error"
              onClose={() => {
                setCloseAlert(false);
                setRejected(false);
              }}
            >
              Your post delete request rejected!
            </Alert>
          ) : (
            ""
          )}

          {closeAlert === true && success === true ? (
            <Alert
              variant="outlined"
              severity="success"
              onClose={() => {
                setCloseAlert(false);
                setSuccess(false);
              }}
            >
              You post deleted successfully.
            </Alert>
          ) : (
            ""
          )}
        </Stack>

        {status === "idle" ? (
          <Stack spacing={2} direction="column" className="card-container">
            {data.map((item) => (
              <Card className="post-card" key={data.indexOf(item)}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {item.userId}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {item.title}
                  </Typography>

                  <Typography variant="body2">{item.body}</Typography>
                </CardContent>
                <CardActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => editPostHandler(item.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteHandler(item.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write a post title and post body in below field
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Post Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={postTitleHandler}
          />
          <TextField
            autoFocus
            margin="dense"
            id="content"
            label="Post Content"
            type="text"
            fullWidth
            variant="standard"
            onChange={postContentHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleClose();
              postHandler();
            }}
            endIcon={<SendIcon />}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AllPost;
