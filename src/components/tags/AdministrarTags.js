/* eslint-disable react-hooks/exhaustive-deps */
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import "./Style.css"
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const AdministrarTags = ({ notaId, prioridad, visible, onClose }) => {
  const URL = process.env.REACT_APP_URL;


  const {updateNota,
    setUpdateNota,} = useContext(GlobalContext);

  const [infoEtiquetas, setInfoEtiquetas] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const data = new FormData();
    data.append("notId", notaId);
    fetch(`${URL}buscarEtiquetas.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setInfoEtiquetas(objetoData);
      });
    });
  }, [notaId]);

  useEffect(() => {
    const data = new FormData();
    data.append("notId", notaId);
    fetch(`${URL}buscarEtiquetasxNota.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        const data = resp;
        const objetoData = JSON.parse(data);
        setSelectedTags(objetoData.map((tag) => tag.etq_id));
      });
    });
  }, [notaId]);

  const handleTagClick = (tagId) => {
    const isSelected = selectedTags.includes(tagId);
    let updatedSelectedTags;

    if (isSelected) {
      updatedSelectedTags = selectedTags.filter((selectedTag) => selectedTag !== tagId);
    } else {
      updatedSelectedTags = [...selectedTags, tagId];
    }

    setSelectedTags(updatedSelectedTags);
  };

  const isTagSelected = (tagId) => {
    return selectedTags.includes(tagId);
  };

  const editTags = () => {
    //console.log(selectedTags);

    const data = new FormData();
    data.append("notId", notaId);
    data.append("tagsE", JSON.stringify(selectedTags));
    fetch(`${URL}guardarEtiquetaxNota.php`, {
      method: "POST",
      body: data,
    }).then(function (response) {
      response.text().then((resp) => {
        //console.log(resp);
      });
    });
    setUpdateNota(!updateNota)
    onClose();
  }

  return (
    <>
      <Drawer
        open={visible}
        onClose={() => onClose()}
        title={"Administrar Etiquetas"}
        width={320}
        closable={true}
        // closeIcon={
        //   <CloseOutlined
        //     style={{ position: "absolute", top: "18px", right: "10px" }}
        //   />
        // }
      >
        {infoEtiquetas &&
          infoEtiquetas.map((tag) => {
            const { etq_nombre, etq_color, etq_id } = tag;
            const isSelected = isTagSelected(etq_id);

            return (
              <div className="tags_wrapper" key={etq_id}>
                <div
                  className={`tag ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleTagClick(etq_id)}
                  style={{
                    background: etq_color,
                  }}
                >
                  <span className="tag_name">{etq_nombre?.toUpperCase()}</span>
                  {isSelected && <CheckOutlined color="white" />}
                </div>
              </div>
            );
          })}

        <Button
          type="primary"
          block
          style={{ marginTop: 10, borderRadius:"0px" }}
          onClick={() => editTags()}
        >
          Guardar
        </Button>
      </Drawer>
    </>
  );
};

export default AdministrarTags;

