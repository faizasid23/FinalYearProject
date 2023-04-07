import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from './../../../../utils/router';

export const Index = (props) => {
    return (
        <div>This is the profile !!</div>
    )
}

const mapStateToProps = (state) => ({ user: state.user?.user })

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Index));