import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

class PositionedSnackbar extends Component {
    state = {
        vertical: 'bottom',
        horizontal: 'right',
    };

    render() {
        const { vertical, horizontal } = this.state;
        const { open, close, message } = this.props;
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    onClose={close}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">{message}</span>}
                />
            </div>
        );
    }
}

export default PositionedSnackbar;