function LogIn() {
    return <div className="flex_wrapper">
            <div className="menu">
                <a href="https://www.ctc.co.il/"><img src="https://www.ctc.co.il/wp-content/uploads/2019/10/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8Flogo-ctc-white-wide-140px.png"/></a>
            </div>
            <div className="flex_login">
                <form method="post">
                    <div className="form-outline mb-4">
                      <label className="form-label" for="form2Example1">Email address</label>
                      <input type="email" id="form2Example1" className="form-control" />
                    </div>
                    <div className="form-outline mb-4">
                      <label className="form-label" for="form2Example2">Password</label>
                      <input type="password" id="form2Example2" className="form-control" />
                    </div>
                    <div className="row mb-4">
                      <div className="col d-flex justify-content-center">
                        <div className="form-check">
                          <input className="form-check-input chbx_base" type="checkbox" value="" id="form2Example31" />
                          <label className="form-check-label" for="form2Example31"> Remember me </label>
                        </div>
                      </div>
                  
                      <div className="col">
                        <a href="#" className="link-success">Forgot password?</a>
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary btn-block btn-danger mb-4">Sign in</button>
                    <div className="text-center">
                      <p>Not a member? <a href="#" className="link-danger">Register</a></p>
                    </div>
                  </form>
            </div>
            </div>
}

export default LogIn;