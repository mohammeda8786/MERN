import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const Comments = () => {
  const API_URL = "https://jsonplaceholder.typicode.com/comments";

  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    body: "",
  });

  useEffect(() => {
    axios.get(API_URL).then((res) => setComments(res.data.slice(0, 20)));
  }, []);

  //=============================================
  const addComment = () => {
    if (!name || !email || !body) {
      alert("All fields required");
      return;
    }
    axios
      .post(API_URL, {
        name,
        email,
        body,
        userId: 1,
      })
      .then((res) => setComments([...comments, res.data]));
    setName("");
    setEmail("");
    setBody("");
  };
  //=============================================
  const editStart = (c) => {
    setEditId(c.id);
    setEditData({
      name: c.name,
      email: c.email,
      body: c.body,
    });
  };

  //=============================================

  const deleteComment = (id) => {
    if(!window.confirm("Are you sure?"))return;
    
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setComments(comments.filter((c) => c.id !== id)));
  };
  //=============================================

  //==================================================
  const updateEdit = () => {
    if (!editData.name || !editData.email || !editData.body) {
      alert("fields should not be empty");
      return;
    }
    axios
      .put(`${API_URL}/${editId}`, {
        name: editData.name,
        email: editData.email,
        body: editData.body,
        userId: 1,
      })
      .then((res) => {
        setComments(comments.map((c) => (c.id === editId ? res.data : c)));
        setEditId(null);
        setEditData({
          name: "",
          email: "",
          body: "",
        });
      });
  };
  //==================================================

  //==================================================
  const cancelEdit = () => {
    setEditId(null);

    setEditData({
      name: "",
      email: "",
      body: "",
    });
  };
  //==================================================
  return (
    <div>
      <h3>Comments list</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Body</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {comments.map((c) => {
            return (
              <tr key={c.id}>
                <td>{c.id}</td>

                {/* edit input inline */}
                <td>
                  {editId === c.id ? (
                    <input
                      className="form-control"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  ) : (
                    c.name
                  )}
                </td>

                <td>{
                (c.id===editId)
                ?(<input className="form-control" value = {editData.email} 
                onChange = {(e)=>setEditData({
                  ...editData,email : e.target.value
                })}/>)
                :(c.email)
                }</td>
                <td>{c.id === editId ? (<input className="form-control" value = {editData.body}
                onChange = {(e)=>setEditData({...editData,body:e.target.value})}/>) :(c.body)}</td>

                <td>
                  {editId !== c.id ? (
                    <>
                      <Button
                        onClick={() => editStart(c)}
                        className="btn btn-secondary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteComment(c.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={updateEdit}>Update</Button>
                      <Button onClick={cancelEdit}>Cancel</Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <td></td>
            <td>
              <input
                className="form-control"
                placeholder="enter the name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </td>
            <td>
              <input
                className="form-control"
                placeholder="enter the email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </td>
            <td>
              <input
                className="form-control"
                placeholder="enter body"
                onChange={(e) => setBody(e.target.value)}
                value={body}
              />
            </td>
            <td>
              <Button onClick={addComment} className="btn btn-primary">
                Add
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Comments;
