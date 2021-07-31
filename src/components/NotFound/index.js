import React from 'react';
import { Link } from 'react-router-dom';

import _404 from './../../img/page_not_found.png'

export default ({ }) => {

    return (
        <div className='w-100 text-center p-2'>
            <img alt='' src={_404} alt="NOT FOUND :'(" className="w-100" />
            <h1 className='mt-3 mb-3 not-found-text'>Ничего не найдено</h1>
            <Link className="button custom-01" to='/'>
                <p>
                    <span className="bg"></span>
                    <span className="base"></span>
                    <span className="text">Вернуться?</span>
                </p>
            </Link>
        </div>
    )
};