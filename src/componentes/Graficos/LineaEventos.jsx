import { Line } from '@ant-design/plots';
import { Button, Modal, Tooltip } from 'antd';

import { saveAs } from 'file-saver';
import { write, utils } from 'xlsx';
import './Graficos.css';
import  { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { HiDocumentDownload } from 'react-icons/hi';

export default function LineaEventos() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const datos = useSelector(state => state.datosFiltrados);
    const location = useLocation();
    const currentUrl = location.pathname;
    const subUrl = currentUrl.startsWith('/dashboard/') ? currentUrl.substring('/dashboard/'.length) : '';
    const modeloSinEspacios = decodeURIComponent(subUrl.replace(/\+/g, " "));
    const [modo, setModo] = useState('serie');
    const tweetsFiltrados = datos.filter(tweet => {
        const propiedadModelo = tweet[modeloSinEspacios];
        return Array.isArray(propiedadModelo) && propiedadModelo.length > 0;
    });
    const dias = datos.map(tweet => tweet.date);
    const diasUnicos = [...new Set(dias)];
    const filtros = useSelector(state => state.filtros);

    const handleModoClick = () => {
        setModo(modo === 'serie' ? 'subserie' : 'serie');
    };

    const handleLineClick = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    let countBySeriesAndDate;

    if (diasUnicos.length > 1) {
        countBySeriesAndDate = getSeriesAndDateCount(tweetsFiltrados.length > 0 ? tweetsFiltrados : datos);
    } else if (diasUnicos.length >= 1) {
        countBySeriesAndDate = getSeriesAndDateCount(tweetsFiltrados.length > 0 ? tweetsFiltrados : datos, true);
    }

    function getSeriesAndDateCount(tweets, isHour = false) {
        return tweets.reduce((count, tweet) => {
            const seriesNames = modo === 'serie' ? [tweet.seriesName] : tweet.subSeriesName;
            const date = isHour ? tweet.hora : tweet.date;

            seriesNames.forEach(name => {
                const seriesName = String(name);

                if (!count[seriesName]) {
                    count[seriesName] = {};
                }
                if (!count[seriesName][date]) {
                    count[seriesName][date] = 0;
                }

                count[seriesName][date]++;
            });

            return count;
        }, {});
    }

    // Filtrar subseries si filtros.subserie está definido
    if (filtros && filtros.subserie && Array.isArray(filtros.subserie) && filtros.subserie.length > 0) {
        const subSeriesFiltradas = filtros.subserie.map(subserie => String(subserie));

        Object.keys(countBySeriesAndDate).forEach(seriesName => {
            if (!subSeriesFiltradas.includes(seriesName)) {
                delete countBySeriesAndDate[seriesName];
            }
        });
    }

    const data = countBySeriesAndDate ? Object.entries(countBySeriesAndDate).flatMap(([seriesName, dates]) => {
        return Object.entries(dates).map(([date, value]) => {
            return {
                Series: seriesName,
                Dia: date,
                Valor: value,
            };
        });
    }) : null;

    let sortedData = []

    if (diasUnicos.length > 1) {
        sortedData = data ? data.sort((a, b) => new Date(a.Dia) - new Date(b.Dia)) : null;
    } else {
        sortedData = data ? data.sort((a, b) => a.Dia - b.Dia) : null;
    }

    const config = {
        data: sortedData,
        xField: 'Dia',
        yField: 'Valor',
        seriesField: 'Series',
        slider: {
            start: 0,
            end: 1,
        },
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
        smooth: true,
        tension: 1,
    };

    const handleDownloadExcel = () => {
        if (sortedData) {
            const worksheet = utils.json_to_sheet(sortedData);
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, 'Datos');
            const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const today = new Date();
            const date = today.toISOString().split('T')[0];
            const fileName = `LineaEventos_${date}.xlsx`;

            saveAs(data, fileName);
        }
    };

    return (
        <div>
            <div className='titulo-carta'>Linea de eventos</div>
            <div className='subtitulo-carta'>
                <div>Cantidad de eventos por día</div>
                <Tooltip title="Descargar Excel">
                    <Button onClick={handleDownloadExcel} type="primary" shape="circle" className='subtitulo-boton'><HiDocumentDownload/></Button>
                </Tooltip>
            </div>
            <Line {...config} className='lineaEventos carta' style={{ height: '300px' }} />
            <Modal title="Mi Modal" open={isModalVisible} onCancel={handleCloseModal} onOk={handleCloseModal}>
                Contenido del modal
            </Modal>
        </div>
    );
}