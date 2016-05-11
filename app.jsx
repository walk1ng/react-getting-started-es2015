class Comment extends React.Component{
	render() {
		return(
			<div>
				<div className="comment-body">
				 {this.props.children}
				</div>
				<div className="comment-author">
				 + {this.props.author}
				</div>
			</div>
		);
	}
}


class CommentList extends React.Component{

	render() {
		var commentsNode = this.props.comments.map(function(comment, index){
			return <Comment author={comment.author} key={"comment-" + index}>{comment.body}</Comment>
		});
		return(
			<div>
				{commentsNode}
			</div>
		);
	}
}

class CommentForm extends React.Component{

	handleSubmit(e) {
		e.preventDefault();
		const author = this.refs.author.getDOMNode().value.trim();
		const body = this.refs.body.getDOMNode().value.trim();
		const form = this.refs.form.getDOMNode();

		this.props.onSubmit({author: author, body: body});

		form.reset();
	}

	render() {
		return(
			<form className="comment-form" ref='form' onSubmit={e => this.handleSubmit(e)}>
				<input type='text' placeholder='your name' ref='author' />
				<input type='text' placeholder='your comment' ref='body' />
				<input type='submit' value='add' />
			</form>
		);
	}
}


class CommentBox extends React.Component{

	constructor(props) {
		super();
		this.state = {
			comments: props.comments || []
		};
	}

	loadDataFromServer() {
		$.ajax({
			url: this.props.url,
			dataType: "json",
			success: comments => {
				this.setState({
					comments: comments
				})
			},
			error: (xhr, status, err)  => {
				console.log('msg:' + err.toString());
			}
		});
	}

	componentDidMount() {
		this.loadDataFromServer();
	}

	handleNewComment(newcomment) {

		const comments = this.state.comments;
		const newComments = comments.concat([newcomment]);
		this.setState({comments: newComments});

		setTimeout(() => {
				$.ajax({
				url: this.props.url,
				dataType: 'json',
				type: 'POST',
				data: newcomment,
				success: comments => {
					this.setState({comments: comments});
				},
				error: (xhr, status, err) => {
					console.log(err.toString());
					this.setState({comments: comments});
				}
			});
		}, 100);


		
	}

	render() {
		return (
			<div>
				<h1>Comments</h1>
				<CommentList comments={this.state.comments}/>
				<CommentForm onSubmit={newcomment => {this.handleNewComment(newcomment)}}/>
			</div>
		);
	}
}

box = React.render(
	<CommentBox url="comments.json"/>, 
	document.getElementById('content')
)