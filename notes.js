var Todo = React.createClass ({
    render: function() {
        var style = { backgroundColor: this.props.color };
        return (
            <div className="todo" style={style}>
          <span className="action-todo" onClick={this.props.color == '#FFFF00' ? this.props.onChangeToDone : this.props.color == '#00FF00' ? this.props.onChangeToArchive :this.props.onDelete}> {this.props.color == '#FFFF00' ? 'Done' : this.props.color == '#00FF00'?'Archive':'x'}</span>
          <span className="action-cancel-todo" onClick={this.props.color == '#B2B2B2' ? this.props.onChangeCancelArchive : this.props.color == '#00FF00' ? this.props.onChangeCancelDone: ''}> {this.props.color == '#B2B2B2' ? 'To Done' : this.props.color == '#00FF00' ? 'To Active': ''}</span>
                {this.props.children}
            </div>
        );
    }
});

var TodoEditor = React.createClass ({
    getInitialState: function(){
        return {
            text: '',
        };
    },
    handleTextChange: function(event){
        this.setState({ text: event.target.value});
    },
    handleTodoAdd: function(){
        var newTodo = {
            text: this.state.text,
            color: '#FFFF00',
            id: Date.now()
        };

        this.props.onTodoAdd(newTodo);
        this.setState({ text: ''});
    },
    render: function(){
        return (
                <div className="todo-editor">
                    <input
                        placeholder="Enter here your todo!.."
                        type='text'
                        className = 'input'
                        value={this.state.text}
                        onChange={this.handleTextChange}
                     />
                     <button className="add-button" onClick={this.handleTodoAdd}>Add</button>
                </div>
        );
    }
});

var TodoActive = React.createClass({
    render:function(){
        var onTodoDelete = this.props.onTodoDelete;
        var onChangeToDone = this.props.onChangeToDone;
        return (
                <div className="todo-active">
                Active:
                {
                    this.props.todosActive.map(function(todo){
                        return   (
                        <Todo
                            key={todo.id}
                            onChangeToDone={onChangeToDone.bind(null, todo)}
                            color='#FFFF00'>
                            {todo.text}
                        </Todo>
                        );
                })
            }
                </div>
        );
    }
});

var TodoDone = React.createClass({
    render:function(){
        var onChangeToArchive = this.props.onChangeToArchive;
        var onChangeCancelDone = this.props.onChangeCancelDone;
        return (
                <div className="todo-done">
                Done:
                {
                    this.props.todosDone.map(function(todo){
                        return   (
                        <Todo key={todo.id}
                        onChangeToArchive={onChangeToArchive.bind(null, todo)}
                        onChangeCancelDone={onChangeCancelDone.bind(null, todo)}
                        color='#00FF00'>
                            {todo.text}
                        </Todo>
                        );
                })
            }
                </div>
        );
    }
});

var TodoArchive = React.createClass({
    render:function(){
        var onTodoDelete = this.props.onTodoDelete;
        var onChangeCancelArchive = this.props.onChangeCancelArchive;
        return (
                <div className="todo-archive">
                Archive:
                {
                    this.props.todosArchive.map(function(todo){
                        return   (
                        <Todo
                            key={todo.id}
                            color='#B2B2B2'
                            onDelete={onTodoDelete.bind(null, todo)}
                            onChangeCancelArchive={onChangeCancelArchive.bind(null, todo)}
                            >
                            {todo.text}

                        </Todo>
                        );
                })
            }
                </div>
        );
    }
});

var TodosApp = React.createClass ({
    getInitialState: function(){
        return {
                todosActive: [
                    ],
                todosDone: [
                    ],
                todosArchive: [
                    ],
        };

    },
    componentDidMount: function(){
        var localTodosActive = JSON.parse(localStorage.getItem('todosActive'));
        if (localTodosActive) {
            this.setState({todosActive: localTodosActive});
        }
        var localTodosDone = JSON.parse(localStorage.getItem('todosDone'));
        if (localTodosDone) {
            this.setState({todosDone: localTodosDone});
        }
        var localTodosArchive = JSON.parse(localStorage.getItem('todosArchive'));
        if (localTodosArchive) {
            this.setState({todosArchive: localTodosArchive});
        }
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleTodoDelete: function(todo) {
        var todoId = todo.id;
        var newTodos = this.state.todosArchive.filter(function(todo) {
            return todo.id !== todoId;
        });
        this.setState({ todosArchive: newTodos });
    },

    handleTodoAdd: function(newTodo) {
        var newTodos = this.state.todosActive;
        newTodos.unshift(newTodo);
        this.setState({ todosActive: newTodos });
    },
    handleChangeToDone: function(todo){
        var todoId = todo.id;
        var newTodosActive = this.state.todosActive.filter(function(todo) {
            return todo.id !== todoId;
        });
        var newTodoActive = this.state.todosActive.filter(function(todo) {
            return todo.id == todoId;
        });
        var newTodosDone = this.state.todosDone;
        newTodosDone.unshift(newTodoActive[0]);
        this.setState({ todosDone: newTodosDone });
        this.setState({ todosActive: newTodosActive });
    },
    handleChangeToArchive: function(todo){
        var todoId = todo.id;
        var newTodosDone = this.state.todosDone.filter(function(todo) {
            return todo.id !== todoId;
        });
        var newTodoArchive = this.state.todosDone.filter(function(todo) {
            return todo.id == todoId;
        });
        var newTodosArchive = this.state.todosArchive;
        newTodosArchive.unshift(newTodoArchive[0]);
        this.setState({ todosDone: newTodosDone });
        this.setState({ todosArchive: newTodosArchive });
    },
    handleCancelArchive: function(todo){
        var todoId = todo.id;
        var newTodosArchive = this.state.todosArchive.filter(function(todo) {
            return todo.id !== todoId;
        });
        var newTodoDone = this.state.todosArchive.filter(function(todo) {
            return todo.id == todoId;
        });
        var newTodosDone = this.state.todosDone;
        newTodosDone.unshift(newTodoDone[0]);
        this.setState({ todosDone: newTodosDone });
        this.setState({ todosArchive: newTodosArchive });
    },
    handleCancelDone: function(todo){
        var todoId = todo.id;
        var newTodosDone = this.state.todosDone.filter(function(todo) {
            return todo.id !== todoId;
        });
        var newTodoActive = this.state.todosDone.filter(function(todo) {
            return todo.id == todoId;
        });
        var newTodosActive = this.state.todosActive;
        newTodosActive.unshift(newTodoActive[0]);
        this.setState({ todosDone: newTodosDone });
        this.setState({ todosActive: newTodosActive });
    },
    render: function() {
        return (
            <div className="todos-app">
                    <TodoEditor onTodoAdd={this.handleTodoAdd}/>
                    <div className="todo-list">
                        <TodoActive todosActive={this.state.todosActive} todosDone={this.state.todosDone} onChangeToDone={this.handleChangeToDone}/>
                        <TodoDone todosDone={this.state.todosDone} todosArchive={this.state.todosArchive} onChangeToArchive={this.handleChangeToArchive}
                        onChangeCancelDone={this.handleCancelDone}/>
                        <TodoArchive todosArchive={this.state.todosArchive} onTodoDelete={this.handleTodoDelete} onChangeCancelArchive={this.handleCancelArchive}/>
                    </div>
            </div>
        );
    },
    _updateLocalStorage: function() {
        var todosActive = JSON.stringify(this.state.todosActive);
        var todosDone = JSON.stringify(this.state.todosDone);
        var todosArchive = JSON.stringify(this.state.todosArchive);
        localStorage.setItem('todosActive', todosActive);
        localStorage.setItem('todosDone', todosDone);
        localStorage.setItem('todosArchive', todosArchive);
    }
});

ReactDOM.render(
    <TodosApp />,
    document.getElementById('todo-app')
);
