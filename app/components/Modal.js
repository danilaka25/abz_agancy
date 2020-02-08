import React from "react";

export default class Modal extends React.Component {
  
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  }

  render() {

    if (!this.props.show) {
      return null;
    }
  
    return (
        <div className="modal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">{this.props.content.message}</h6>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">      
            {/* {this.props.content.success ? (   
                <div>{this.props.content.message}</div>
            ) : (
                <ul>
                 {petList}        
                </ul>           
            )} */}

            </div>
          </div>
        </div>
      </div>
    );
  }
}