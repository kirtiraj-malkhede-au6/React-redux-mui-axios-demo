import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axios from "axios";
import store from "../store/store";
import { updatePost } from "../features/postSlice";
import { useSelector } from "react-redux";
const EditPost = () => {
  const [loading, setLoading] = useState(false);
  const { post } = useSelector((state) => {
    return state.post;
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [closeAlert, setCloseAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rejected, setRejected] = useState(false);

  const [waiting, setWaiting] = useState(false);
  let params = useParams();

  useEffect(
    () => async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${params.id}`
        );
        console.log(response.data);
        store.dispatch(updatePost(response.data));
        setLoading(true);
      } catch (err) {
        console.error(err);
      }
    },
    [params.id]
  );

  const titleChangeHandler = (event) => {
    setTitle(event.target.value);
  };
  const contentChangeHandler = (event) => {
    setContent(event.target.value);
  };
  const editPostHandler = async () => {
    if (closeAlert === true) {
      setCloseAlert(false);

      setRejected(false);
      setSuccess(false);
    }

    try {
      setWaiting(true);
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/posts/${params.id}`,
        {
          id: params.id,
          userId: post.userId,
          title: title,
          body: content,
        },
        {
          headers: {},
        }
      );
      console.log(response);
      store.dispatch(updatePost(response.data));
      setWaiting(false);
      setCloseAlert(true);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setCloseAlert(true);
      setRejected(true);
      setWaiting(false);
    }
  };

  return (
    <Fragment>
      {loading === true ? (
        <Fragment>
          <Stack
            sx={{
              ml: "35%",
              mt: "30px",
              width: "30%",
              display: "flex",
              alignItems: "center",
            }}
            spacing={2}
          >
            {waiting === true ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            ) : (
              ""
            )}
            {closeAlert === true && rejected === true ? (
              <Alert
                variant="outlined"
                severity="error"
                onClose={() => {
                  setCloseAlert(false);
                  setRejected(false);
                }}
              >
                Your post edit request rejected!
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
                You post edited successfully.
              </Alert>
            ) : (
              ""
            )}
          </Stack>
          <Card className="post-card" sx={{ ml: "30%", mt: "5%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {post.userId}
              </Typography>
              <Typography variant="h5" component="div">
                {post.title}
              </Typography>

              <Typography variant="body2">{post.body}</Typography>
            </CardContent>
            <CardActions></CardActions>
          </Card>
          <Card
            className="post-card"
            sx={{
              ml: "30%",
              mt: "5%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <TextField
              fullWidth
              label="Title"
              color="secondary"
              onChange={titleChangeHandler}
            ></TextField>
            <TextField
              fullWidth
              label="Content"
              color="secondary"
              onChange={contentChangeHandler}
            ></TextField>
            <Button
              variant="contained"
              sx={{ width: "80px" }}
              color="success"
              onClick={editPostHandler}
            >
              Save
            </Button>
          </Card>
        </Fragment>
      ) : (
        <Box sx={{ my: "30%", mx: "45%", display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
    </Fragment>
  );
};

export default EditPost;
