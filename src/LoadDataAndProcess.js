import React from "react";

import Action from "./Action";

//https://reactjs.org/docs/faq-ajax.html

class LoadDataAndProcess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
          muffinPrice: props.muffinPrice,
          startDateString: props.startDateString,
          endDateString: props.endDateString,
          spendinglimit: props.spendinglimit
        };
      }
    
      componentDidMount() {
        fetch("http://localhost:3000/voo-2018-present.json")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.items
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }
    
      render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {




          return (
            <div>
              {`m: ${this.props.muffinPrice}`}
              {items.map(item => (
                <Action />
                // <p key={item.Date}>
                //   {`${item.Date}:  ${item.NAV}`}
                // </p>
              ))}
            </div>
          );
        }
      }

}

export default LoadDataAndProcess;