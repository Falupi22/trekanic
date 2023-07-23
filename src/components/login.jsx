function LogIn() {
    return <div class="flex_wrapper">
            <div class="menu">
                <a href="https://www.ctc.co.il/"><img src="https://www.ctc.co.il/wp-content/uploads/2019/10/%E2%80%8F%E2%80%8F%E2%80%8F%E2%80%8Flogo-ctc-white-wide-140px.png"/></a>
            </div>
            <div class="flex_login">
                <form method="post">
                    <div class="form-outline mb-4">
                      <label class="form-label" for="form2Example1">Email address</label>
                      <input type="email" id="form2Example1" class="form-control" />
                    </div>
                    <div class="form-outline mb-4">
                      <label class="form-label" for="form2Example2">Password</label>
                      <input type="password" id="form2Example2" class="form-control" />
                    </div>
                    <div class="row mb-4">
                      <div class="col d-flex justify-content-center">
                        <div class="form-check">
                          <input class="form-check-input chbx_base" type="checkbox" value="" id="form2Example31" />
                          <label class="form-check-label" for="form2Example31"> Remember me </label>
                        </div>
                      </div>
                  
                      <div class="col">
                        <a href="#" class="link-success">Forgot password?</a>
                      </div>
                    </div>
                    <button type="button" class="btn btn-primary btn-block btn-danger mb-4">Sign in</button>
                    <div class="text-center">
                      <p>Not a member? <a href="#" class="link-danger">Register</a></p>
                    </div>
                  </form>
            </div>
            </div>
}

export default LogIn;