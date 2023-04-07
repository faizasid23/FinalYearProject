import React from 'react'
import { connect } from 'react-redux'

export const Index = (props) => {
    return (
        <div>This is the dashboard !!</div>
    )
}

const mapStateToProps = (state) => ({ user: state.user?.userF })

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Index)