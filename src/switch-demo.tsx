import React, {useState} from 'react';


function ModeZero() {
    return (
        <div>
        <h2>This is mode zero.</h2>
        </div>
    );
}

function ModeOne() {
    return (
        <div>
          <h2>This is mode one.</h2>
        </div>
    );
}

function SwitchedMode(props: {selectedUi: number}) {
    switch (props.selectedUi) {
        case 0:
            return <ModeZero/>;
        case 1:
            return <ModeOne/>;
        default:
            throw new Error("no");
    }
}


export function SwitchDemo() {
    const [selectedUi, setSelectedUi] = useState(0);  // should be enum

    function toggleUi() {
        if (selectedUi === 0) {
            setSelectedUi(1);
        } else {
            setSelectedUi(0);
        }
    }

    return (
        <div>
          <h1>Foo</h1>

          <p>UI is {selectedUi}</p>

          <button onClick={toggleUi}>Toggle ui</button>
          <SwitchedMode selectedUi={selectedUi}/>
        </div>
    );
}
