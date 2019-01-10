import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import PositionedSnackbar from './snackbar';

class App extends Component {

  constructor() {
    super();
    this.state = {
      todo: [],
      message: '',
      index: '',
      editing: false,
      open: false,
      msg: '',
    }
    this.path = 'http://localhost:8080';
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    axios.get(`${this.path}/api/todos`)
      .then(res => {
        this.setState({
          todo: res.data,
        })
      })
      .catch(err => {
        this.setState({
          open: true,
          msg: err,
        })
      })
  }

  handleChange = ev => {
    const { name, value } = ev.target;
    this.setState({
      [name]: value,
    });
  }

  onSubmit = () => {
    const { message, editing, todo, index } = this.state;
    if (!message) return this.setState({ open: true, msg: 'Message field cannot be left empty'})
    if (!editing) {
      const addTodo = {
        id: todo.length + 1,
        message
      }
      axios.post(`${this.path}/api/todos`, addTodo)
        .then(res => {
          this.setState({
            message: '',
            open: true,
            msg: res.data,
          })
          this.getData();
        })
        .catch(err => {
          this.setState({
            open: true,
            msg: err,
          })
        })
    }
    else {
      const theTodo = todo[index];
      theTodo.message = message;
      axios.put(`${this.path}/api/todos/${theTodo.id}`, theTodo)
        .then(res => {
          this.setState({
            message: '',
            editing: false,
            open: true,
            msg: res.data,
          })
          this.getData();
        })
        .catch(err => {
          this.setState({
            open: true,
            msg: err,
          })
        })
    }
  }

  onEdit = index => {
    const { message } = this.state.todo[index];
    this.setState({
      message,
      index,
      editing: true,
    })
  }

  onDelete = index => {
    const theTodo = this.state.todo[index];
    axios.delete(`${this.path}/api/todos/${theTodo.id}`)
      .then(res => {
        this.setState({
          message: '',
          editing: false,
          open: true,
          msg: res.data,
        })
        this.getData();
      })
      .catch(err => {
        this.setState({
          open: true,
          msg: err,
        })
      })
  }

  handleCloseMessage = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    const {
      message, todo, editing,
      open, msg
    } = this.state;
    return (
      <div className='container'>
        <div className='form-group'>
          <input
            className='form-control'
            placeholder='Message'
            type='text'
            name='message' value={message}
            onChange={this.handleChange}
          />
          <input
            className={editing ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm'}
            onClick={this.onSubmit}
            type='button'
            value={editing ? 'Update' : 'Submit'}
          />
        </div>
        <div className='todo-width'>
          {(Array.isArray(todo) && todo.length > 0) && (
            <table className="table table-bordered table-hover table-sm">
              <caption>List of Todos</caption>
              <thead className='thead-light'>
                <tr className='align-center'>
                  <th scope='col'>S.No</th>
                  <th scope='col'>Todos</th>
                  <th scope='col' colSpan='2'>Options</th>
                </tr>
              </thead>
              <thead className='align-center'>
                {todo.map((val, ind) => {
                  return (
                    <tr key={ind}>
                      <td>{ind + 1}</td>
                      <td style={{ textAlign: 'left' }}>{val.message}</td>
                      <td>
                        <input
                          className='btn btn-secondary btn-sm'
                          type='button'
                          value='Edit'
                          onClick={() => this.onEdit(ind)}
                        />
                      </td>
                      <td>
                        <input
                          className='btn btn-danger btn-sm'
                          type='button'
                          value='Delete'
                          onClick={() => this.onDelete(ind)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </thead>
            </table>
          )}
        </div>
        <PositionedSnackbar
          open={open}
          message={msg}
          close={this.handleCloseMessage}
        />
      </div>
    );
  }
}

export default App;
