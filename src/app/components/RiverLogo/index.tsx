/*
    Creation Time: 2018 - Oct - 05
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2018
*/

import * as React from 'react';

import './style.css';

interface IProps {
    height: number | string;
    width: number | string;
}

interface IState {
    height?: number;
    width?: number;
}

class RiverLogo extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    public render() {
        return (
            <span className="river-logo">
                <svg width={this.props.width} height={this.props.height} viewBox="0 0 48 48" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48H5.07489C2.27211 48 0 45.7279 0 42.9251V24Z"
                        fill="url(#paint0_linear)"/>
                    <path
                        d="M13.2413 16.003V11.3497H25.3754C27.4219 11.3497 30.193 12.8258 31.7879 14.9252C33.9735 17.8022 33.9406 21.484 31.268 25.175L27.4969 22.4466C28.9895 20.3853 28.595 18.4995 28.0804 17.7393C27.4034 16.739 26.2965 16.003 25.3754 16.003H13.2413Z"
                        fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M25.6514 11.3584C25.6232 11.3578 25.5947 11.3575 25.566 11.3575C25.2842 11.3575 25.0402 11.3548 24.8302 11.3497H13.2413V16.003H25.3754C26.2965 16.003 27.4033 16.739 28.0803 17.7393C28.4108 18.2274 28.6915 19.1797 28.4553 20.3442C28.4619 20.3152 28.4679 20.2857 28.4733 20.2557C28.9221 17.7572 29.6245 12.397 26.5448 11.4894C26.2384 11.4204 25.9388 11.376 25.6514 11.3584Z"
                          fill="#E2E2E2"/>
                    <path
                        d="M29.8818 27.528C32.8056 30.5104 34.7586 34.3421 34.7586 36.8867H30.1033C30.1033 36.7396 30.053 36.4551 29.942 36.09C29.8036 35.6349 29.589 35.1124 29.3074 34.5599C28.6548 33.2796 27.7107 31.9619 26.5568 30.7849C24.2257 28.4071 21.3074 26.8193 17.8966 26.3104V36.5562H13.2413C13.2413 36.5562 13.2413 23.9999 13.2413 23.1117C13.2413 22.2236 14.1237 21.4775 14.8991 21.4775C16.0392 21.4775 16.7386 21.5098 16.9978 21.5279C17.2621 21.5463 17.4913 21.5683 17.6854 21.5939C22.5127 22.0958 26.6593 24.241 29.8818 27.528Z"
                        fill="#E2E2E2"/>
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M32.6487 31.0311C31.8877 29.8195 30.9495 28.6171 29.8817 27.528C26.6593 24.241 22.5127 22.0958 17.6854 21.5939C17.4913 21.5683 17.2621 21.5463 16.9978 21.5279C16.7385 21.5098 16.0392 21.4775 14.8992 21.4775C14.1237 21.4775 13.2413 22.2236 13.2413 23.1117V36.8867H17.8966V27.528C17.8966 26.2844 18.3257 26.3745 18.5668 26.4251L18.6005 26.432C19.1093 26.5321 19.6066 26.6568 20.0919 26.805C23.6356 27.1625 30.3773 28.3338 32.6487 31.0311Z"
                          fill="white"/>
                    <defs>
                        <linearGradient id="paint0_linear" x1="40.4335" y1="4.61084" x2="4.13793" y2="45.0443"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#27AE60"/>
                            <stop offset="1" stopColor="#158243"/>
                        </linearGradient>
                    </defs>
                </svg>
            </span>
        );
    }
}

export default RiverLogo;
