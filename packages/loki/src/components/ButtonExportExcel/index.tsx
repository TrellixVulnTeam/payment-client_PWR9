import React from 'react';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Button, { ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import { iToast } from '@ilt-core/toast';

type CSVItem = {
  sheetName: string;
  heading: any[];
  header: string[];
  data: any[];
  wscols?: number[];
};

type CSVData = {
  sheetName: string;
  heading: any[];
  header: string[];
  data: any[];
  wscols?: number[];
}[];

type Props = {
  csvData: CSVData;
  fileName: string;
};

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const DEFAULT_WIDTH = 10;

const calculationColWidth = (csvItem: CSVItem) => {
  return [
    ...csvItem.header.map((prop) => ({
      wch: Math.max(...csvItem.data.map((item) => item[prop]?.length || DEFAULT_WIDTH)),
    })),
  ];
};

const ButtonExportCSV: React.FC<Props> = ({ csvData, fileName }) => {
  const exportToCSV = () => {
    if (!csvData.length) {
      iToast.warning({
        title: t('No data'),
      });
      return;
    }

    const workbook = XLSX.utils.book_new();

    csvData.forEach((csv) => {
      const ws = XLSX.utils.json_to_sheet(csv.heading, {
        header: csv.header,
        skipHeader: true,
        origin: 0, //ok
      } as any);

      // * Calculation width cell of excel
      ws['!cols'] = calculationColWidth(csv);

      XLSX.utils.sheet_add_json(ws, csv.data, {
        header: csv.header,
        skipHeader: true,
        origin: -1, //ok
      });
      XLSX.utils.book_append_sheet(workbook, ws, csv.sheetName);
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button onClick={exportToCSV} variant={ButtonVariants.secondary}>
      <Typography variant={TypoVariants.button1} weight={TypoWeights.medium}>
        {t('Export')}
      </Typography>
    </Button>
  );
};

export default ButtonExportCSV;
