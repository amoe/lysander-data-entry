import React, {useState} from 'react';


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

          <p>UI is{selectedUi}</p>

          <button onClick={toggleUi}>Toggle ui</button>

        </div>
    );
}
