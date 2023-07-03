import SelectProgress from "./SelectProgress";


const SelectPage = ({ selectForm }) => {
    return (
        <div
            className="select-page">
            <SelectProgress/>
            {selectForm}
        </div>
    )
}

export default SelectPage;