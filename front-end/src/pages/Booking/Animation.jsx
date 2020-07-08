import React, { useEffect } from 'react';
import {useSpring, animated} from 'react-spring'

const Animation = (props) => {

    useEffect(() => {
        
        window.scrollTo(0, 0) // make sure div in top
    
    }, []);

    const propsAnimated = useSpring({ opacity: 1, transform: 'translate3d(0%,0,0)' , from: { opacity: 0, transform: 'translate3d(100%,0,0)' }})

    return (
        <animated.div style={propsAnimated}>
            {props.children}
        </animated.div>
    );
};

export default Animation;