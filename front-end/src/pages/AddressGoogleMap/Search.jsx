import React, { Component, useEffect, useState, useCallback, useRef } from "react";
import './style.css';

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import image from '../../assest/image/icon-1024.png'
import "@reach/combobox/styles.css";



const  Search = ({ panTo }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 21.0044514, lng: () => 105.5122808 },
            radius: 100 * 1000,
        },
    });


    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, "");
        clearSuggestions();

        try {
            const results = await getGeocode({ address });
            // console.log(results);
            const { lat, lng } = await getLatLng(results[0]);
            panTo({ lat, lng });
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div className="search">
            {console.log(ready)}
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Nhập địa chỉ điều dưỡng"

                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ id, description }) => (
                                <ComboboxOption key={id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}
 export default Search;