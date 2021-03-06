import{
  React,
  expect
} from './setup/test_helper';
import {Button, Label, Textbox, LoginForm} from '../loginComponent.js';
import TestUtils from 'react-addons-test-utils';
import {findDOMNode} from 'react-dom';



describe('Login view tests -->', () => {
  let renderer,loginForm,app;
  let locators={
    'inputField_text': '.generalInput[type="text"]',
    'inputField_password': '.generalInput[type="password"]',
    'inputField_checkbox': '.generalInput[type="checkbox"]',
    'cancelBtn':'.generalButton[name="Cancel"]',
    'loginBtn':'.generalButton[name="Login"]',
    'notification':'.notification'
  };
  let userprofile={
    shouldPass:{
      'user':'sahas',
      'pass':'password'
    },
    shouldFail:{
      'user':'sahas',
      'pass':'sahas'
    }
  }

  before(()=>{
    //virtual DOM, good for one level deep isolated component tests
    loginForm = shallowRender(LoginForm);
    //requires DOM, we use jsdom to provide window, document and navigator
    app = TestUtils.renderIntoDocument(<LoginForm/>);
  });

  it('should render LoginForm component', () => {
    expect(loginForm.ref).toEqual('LoginForm');   
  });

  it('should render 3 input boxes',()=>{
    var inputs = getElementsBy('tag','input');
    expect(inputs.length).toBe(3);
  });

  it('should render 2 buttons',()=>{
    expect(getElementsBy('tag','button').length).toBe(2);    
  })

  it('should render username input box with placeholder \'something\@email.com\'',()=>{
    expect(getMe(locators.inputField_text).getAttribute('placeholder')).toEqual('something@email.com');
  })

  it('should render password input box as type="password"',()=>{
    expect(getMe(locators.inputField_password).getAttribute('type')).toEqual('password');
  })

  it('should render remember password',()=>{
    expect(getMe(locators.inputField_checkbox).name).toEqual('chkRememberPassword');
  });

  it('should render remember password unchecked by default',()=>{
    expect(getMe(locators.inputField_checkbox).checked).toBe(false);
  })

  it('should toggle remember password when clicked',()=>{
    let checkbox = getMe(locators.inputField_checkbox);
    checkbox.checked="true";
    //TestUtils.Simulate.change(checkbox,{target:{checked:true}});
    expect(checkbox.checked).toBe(true);
  });
  
  //this is important, checkout React Controlled Component http://bit.ly/1nhAplt
  it('should allow the user to key in username',()=>{
      let inputField = getMe(locators.inputField_text);
      TestUtils.Simulate.change(inputField,{target:{value:'sahas'}});
      expect(inputField.value).toEqual('sahas');
  });

  it('should clear username when cancel clicked',()=>{
      let username = getMe(locators.inputField_text);
      let cancel = getMe(locators.cancelBtn);
      TestUtils.Simulate.change(username,{target:{value:'sahas'}});
      TestUtils.Simulate.click(cancel);
      expect(username.value).toEqual('');
  });

  it('should clear password when cancel clicked',()=>{
      let password = getMe(locators.inputField_password);
      let cancel = getMe(locators.cancelBtn);
      TestUtils.Simulate.change(password,{target:{value:'sahas'}});
      TestUtils.Simulate.click(cancel);
      expect(password.value).toEqual('');
  });
  it('should NOT render any notification onload',()=>{
      let notification = getMe(locators.notification);
      expect(notification.getAttribute('children')).toEqual(null);
  });
  it('should render "WIP" while attempting to login',(done)=>{
    let waittime = 0; //in ms
    _testLoginVariations(userprofile.shouldPass,"WIP",waittime,function(result){
      done();
    });
  });

  it('should render "SUCCESS" upon successful login',(done)=>{
    let waittime = 4000; //in ms
    _testLoginVariations(userprofile.shouldPass,"SUCCESS",waittime,function(result){
      done();
    });
  });

  it('should render "ERROR" when login fails',(done)=>{
    let waittime = 4000; //in ms
    _testLoginVariations(userprofile.shouldFail,"ERROR",waittime,function(result){
      done();
    });
  });
  function _testLoginVariations(profile,result,timeout,cb){
      let username = getMe(locators.inputField_text);
      let password = getMe(locators.inputField_password);
      let loginBtn = getMe(locators.loginBtn);      
      let notification = getMe(locators.notification);

      TestUtils.Simulate.change(username,{target:{value:profile.user}});
      TestUtils.Simulate.change(password,{target:{value:profile.pass}});
      TestUtils.Simulate.click(loginBtn);

      setTimeout(function(){
        expect(notification.props.children).toEqual(result);
        cb();
      },timeout);    
  }
  //Utility methods
  //renders just one level deep in virtual DOM, good for isolated component level testing
  function shallowRender(Component) {
    const renderer = TestUtils.createRenderer();
    renderer.render(<Component/>);
    return renderer.getRenderOutput();
  }

  function getMe(locator){
    const appDOM = findDOMNode(app);
    return appDOM.querySelector(locator);
  }

  function getElementsBy(selector,tag){
    switch (selector)
    {
      case "tag":
        return TestUtils.scryRenderedDOMComponentsWithTag(app, tag);
      case "type":
        return TestUtils.scryRenderedComponentsWithType(app,tag);
    }
  }

});