import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

const Posts = () => {
  // -------------------- STATE --------------------
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    body: "",
  });

  // -------------------- READ --------------------
  useEffect(() => {
    axios.get(API_URL).then((res) => setPosts(res.data));
  }, []);

  // -------------------- CREATE --------------------
  const addPost = () => {
    if (!title || !body) {
      alert("Fields should not be empty");
      return;
    }

    axios
      .post(API_URL, {
        title,
        body,
        userId: 1,
      })
      .then((res) => {
        setPosts([...posts, res.data]);
        setTitle("");
        setBody("");
      });
  };

  // -------------------- DELETE --------------------
  const deletePost = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setPosts(posts.filter((p) => p.id !== id)));
  };

  // -------------------- START EDIT --------------------
  const editStart = (post) => {
    setEditId(post.id);
    setEditData({
      title: post.title,
      body: post.body,
    });
  };

  // -------------------- UPDATE --------------------
  const updateEdit = () => {
    if (!editData.title || !editData.body) {
      alert("Fields should not be empty");
      return;
    }

    axios
      .put(`${API_URL}/${editId}`, {
        title: editData.title,
        body: editData.body,
        userId: 1,
      })
      .then((res) => {
        setPosts(
          posts.map((p) => (p.id === editId ? res.data : p))
        );
        setEditId(null);
        setEditData({ title: "", body: "" });
      });
  };

  // -------------------- CANCEL EDIT --------------------
  const cancelEdit = () => {
    setEditId(null);
    setEditData({ title: "", body: "" });
  };

  // -------------------- UI --------------------
  return (
    <div className="container mt-4">
      <h3>Post List (Inline Edit CRUD)</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>

              {/* TITLE CELL */}
              <td>
                {editId === p.id ? (
                  <input
                    className="form-control"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        title: e.target.value,
                      })
                    }
                  />
                ) : (
                  p.title
                )}
              </td>

              {/* BODY CELL */}
              <td>
                {editId === p.id ? (
                  <input
                    className="form-control"
                    value={editData.body}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        body: e.target.value,
                      })
                    }
                  />
                ) : (
                  p.body
                )}
              </td>

              {/* ACTIONS */}
              <td>
                {editId === p.id ? (
                  <>
                    <Button
                      className="btn btn-success me-2"
                      onClick={updateEdit}
                    >
                      Update
                    </Button>
                    <Button
                      className="btn btn-secondary"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="btn btn-primary me-2"
                      onClick={() => editStart(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="btn btn-danger"
                      onClick={() => deletePost(p.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>

        {/* ADD FORM */}
        <tfoot>
          <tr>
            <td></td>
            <td>
              <input
                className="form-control"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </td>
            <td>
              <input
                className="form-control"
                placeholder="Enter body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </td>
            <td>
              <Button onClick={addPost} className="btn btn-primary">
                Add
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Posts;
