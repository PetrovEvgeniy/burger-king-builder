import React, { useState } from 'react';
import {connect} from 'react-redux';
 
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions'

const ContactData = props => {
    const [orderForm, setOrderForm] = useState({
        //add a telephone maybe? :)
            name: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 30
                },
                valid: false,
                touched: false,
                errorMessage: "The name should contain between 3 and 30 characters."
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 8,
                    maxLength: 40
                },
                valid: false,
                touched: false,
                errorMessage: "The street should contain between 8 and 40 characters."
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    match: /^[0-9]{4}$/
                    
                },
                valid: false,
                touched: false,
                errorMessage: "The ZIP Code should contain only 4 digits"
                
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type:'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 4,
                    maxLength: 30
                },
                valid: false,
                touched: false,
                errorMessage: "The country should contain between 4 and 30 characters.",
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type:'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    
                },
                valid: false,
                touched: false,
                errorMessage: "Please enter a valid email."
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                   options: [
                       {value: 'cheapest', displayValue: 'Cheapest'},
                       {value: 'fastest', displayValue: 'Fastest'}
                    ]
                },
                value: 'cheapest',
                validation:{},
                valid: true
            }
        });
        const [formIsValid, setFormIsValid] = useState(false)

    

   const orderHandler = (event,token) => {
        event.preventDefault();

        const formData = {};
        for(let formElementIdentifier in orderForm){
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: props.ings,
            price: props.price,
            orderData: formData,
            userId: props.userId
        }
        
        props.onOrderBurger(order,props.token);

    }

   const checkValidity = (value, rules) => {
        let isValid = true;

        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
            isValid = value.trim().length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.trim().length <= rules.maxLength && isValid;
        }

        if(rules.match){
            isValid = value.trim().match(rules.match) && isValid;
        }

        return isValid;
    }

   const inputChangeHandler = (event,inputIdentifier) => {
        const updatedOrderForm = {
            ...orderForm
        }
        const updatedFormElement = { 
            ...updatedOrderForm[inputIdentifier]
        }

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        setOrderForm(updatedOrderForm)
        setFormIsValid(formIsValid)
    }

        const formElementsArray = [];
        for(let key in orderForm){
            formElementsArray.push({
                id: key,
                config: orderForm[key]
            })
        }
        let form = (
            <form onSubmit={orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig} 
                    value={formElement.config.value}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    errorMessage={formElement.config.errorMessage}
                    touched={formElement.config.touched}
                    
                    handleChange={(event) => inputChangeHandler(event,formElement.id)}/>
                ))}
                <Button btnType="Success" disabled={!formIsValid} clicked={orderHandler}>ORDER</Button>
            </form>);
        if (props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    
}

const mapStateToProps = state => {
    return{
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onOrderBurger: (data,token) => dispatch(actions.purchaseBurger(data,token)) 
    }

}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData,axios));