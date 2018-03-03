import React, { Component } from "react";
import { connect } from "react-redux";
import { getTrace } from "./actions/api.js";

const Trace = ({ trace }) => (
  <ul>{trace.map(t => <li key={t.id}>{t.id}</li>)}</ul>
);

class TraceContainer extends Component {
  componentDidMount() {
    this.props.onLoad(this.props.match.params.id);
  }

  render() {
    return <Trace trace={this.props.trace} />;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    trace: state.traces[ownProps.match.params.id] || []
  };
}

export default connect(mapStateToProps, dispatch => ({
  onLoad: id => {
    dispatch(getTrace(id));
  }
}))(TraceContainer);
