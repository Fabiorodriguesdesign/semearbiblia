import React from 'react';

const BackButton = React.memo(({ onClick, text }: { onClick: () => void, text: string }) => (
    <button className="back-button" onClick={onClick}>
        <i className="material-icons">arrow_back</i>
        <span>{text}</span>
    </button>
));

export default BackButton;
