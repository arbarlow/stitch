import React, { Component } from "react";
import * as d3 from "d3";
import { schemePastel1 } from "d3-scale-chromatic";
import ReactFauxDOM from "react-faux-dom";
import { connect } from "react-redux";
import { getTrace } from "./actions/api.js";
import { filter, flattenDeep } from "lodash";
import styles from "./Trace.css";
console.log(styles);

const traceTree = (trace, traces) => {
  if (!trace.parentId) {
    return trace;
  }

  const children = filter(traces, x => x.parentId === trace.id).map(x =>
    traceTree(x, traces)
  );
  return { ...trace, children };
};

const flatten = x => {
  const ts = [x];
  if (x.children) {
    x.children = x.children.map(flatten);
    ts.push(x.children);
  }
  return ts;
};

const Trace = ({ trace }) => {
  if (!trace) {
    return null;
  }

  var el = ReactFauxDOM.createElement("div");

  const rootTraces = filter(
    trace,
    x => !x.parentId || x.parentId === x.traceId
  );
  let traces = rootTraces.map(t => traceTree(t, trace));
  traces = flattenDeep(traces.map(flatten));

  var margin = { top: 50, right: 50, bottom: 50, left: 100 },
    width = 1300 - margin.left - margin.right,
    height = trace.length * 20 - margin.top - margin.bottom;

  const startTime = traces[0].timestamp;

  var y = d3
    .scaleBand()
    .range([0, height])
    .round(0.2);

  var x = d3.scaleLinear().range([0, width]);

  y.domain(
    traces.map(function(d) {
      return d.id;
    })
  );

  x.domain([
    d3.min(traces, d => d.timestamp - startTime),
    d3.max(traces, d => d.timestamp - startTime + d.duration)
  ]);

  var svg = d3
    .select(el)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xAxis = d3.axisTop(x).tickFormat(d => d / 1000 + " ms");
  const yAxis = d3.axisLeft(y).tickFormat((d, i) => traces[i].name);

  svg
    .append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .append("text")
    .attr("x", width - margin.right)
    .attr("dx", ".71em")
    .attr("dy", "-0.2em")
    .text("Date");

  const blues = d3.scaleOrdinal(schemePastel1);

  svg
    .selectAll(".bar")
    .data(traces)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", i => blues(i.id))
    .attr("y", function(d) {
      return y(d.id);
    })
    .attr("height", 16)
    .attr("x", function(d) {
      return x(d.timestamp - startTime);
    })
    .attr("width", d =>
      Math.max(
        x(d.timestamp - startTime + d.duration) - x(d.timestamp - startTime),
        4
      )
    );

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis);

  svg
    .selectAll(".text")
    .data(trace)
    .enter()
    .append("text")
    .attr("class", styles.text)
    .attr("y", function(d) {
      return y(d.id) + 12;
    })
    .attr("x", function(d) {
      return (
        Math.max(
          x(d.timestamp - startTime) +
            x(d.timestamp - startTime + d.duration) -
            x(d.timestamp - startTime),

          4
        ) + 6
      );
    })
    .text(d => {
      return d.duration / 1000 + " ms";
      // return d.name;
      // const url = find(d.binaryAnnotations, x => {
      //   return x.key === "http.url";
      // });

      // return url ? url.value : d.name;
    });

  // Render it to React elements.
  return el.toReact();
};

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
    trace: state.traces[ownProps.match.params.id]
  };
}

export default connect(mapStateToProps, dispatch => ({
  onLoad: id => {
    dispatch(getTrace(id));
  }
}))(TraceContainer);
