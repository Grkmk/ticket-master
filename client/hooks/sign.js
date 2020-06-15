import React, { useState } from 'react';
import Router from 'next/router';

import useRequest from './use-request';

export default ({ url, text }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url,
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async e => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{text}</h1>
      <div className='form-group'>
        <label>Email Address</label>
        <input
          className='form-control'
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          type='password'
          className='form-control'
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className='btn btn-primary'>Sign Up</button>
    </form>
  );
};
