import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Start extends Component {
    render() {
        return (
            <Link to="/login"><div className="text-center my-5">
                <div className='btn btn-lg text-center btn-danger'>Start</div>
            </div></Link>
        )
    }
}
