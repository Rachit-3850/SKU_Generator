import React from "react";
import "./styles.css";
import { Button } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import { message } from "antd";
import CSVDownloadLink from "./CSVDownloadLink";
import { CSVLink } from "react-csv";
const UI = ({
	importDataFromCsv,
	data,
	exportDataToCsv,
	value,
	upload,
	setUpload,
	setValue,
	downloadFlagRef,
}: any) => {
	const fileTypes = ["csv"];
	const [api, contextHolder] = message.useMessage();

	const error = () => {
		api.open({
			type: "error",
			content: "Only CSV files are supported",
			duration: 10,
		});
	};
	const successMessage = () => {
		api.open({
			type: "success",
			content: "SKUs are generated. Please check the downloaded file",
			duration: 10,
		});
	};
	const sampleData = [
		["name", "variant_name"],
		["ADIDAS CLASSIC BACKPACK", "OS / BLACK"],
		["ADIDAS | SUPERSTAR 80S", "5 / WHITE"],
		["COFFEE MUGS", "	RED W"],
		["ADIDAS | KID'S STAN SMITH", "2 / WHITE"],
		["CONVERSE | CHUCK TAYLOR ALL STAR", "6 / BLACK"],
	];

	return (
		<div className="Container p-3">
			<div className="main-content row  d-flex align-items-center justify-content-center">
				<div className="col-md-7">
					<div>
						<div className="page-title pb-2"> SKU Generator</div>
					</div>
					<div>
						<div className="mb-3">
							<div className="bg-white">
								<div style={{ padding: "22.5px" }}>
									<div className="short-notes">
										This tool is in beta right now. It recommends readable SKUs
										for your products based on the products name and variant
										names. If you have any questions or comments, please write
										to us at support@sumtracker.com
										<br />
										<br />
										Upload CSV file to generate SKUs for your products. The CSV
										file must have the name and variant_name columns.
										<br />
										<br />
										"name" column is used for the name of the product for
										example: t-shirt
										<br />
										"variant_name" column is used for the variation name for
										example: Large Blue
									</div>
								</div>
								<div
									style={{ padding: "22.5px" }}
									className="d-flex flex-column justify-content-center"
								>
									{data && data.length ? (
										<>
											{/* <CSVDownload //automatic download file
													data={exportDataToCsv(data)}
													filename={"sku-generator.csv"}
													target="##"
													
												/> */}
											<div>
												<CSVDownloadLink
													data={exportDataToCsv(data)}
													fileName="sku-gen-output.csv"
													successMessage={successMessage}
													downloadFlagRef={downloadFlagRef}
													upload={upload}
													setUpload={setUpload}
												/>
											</div>
											<CSVLink data={sampleData} filename="sku-gen-sample.csv">
												<Button
													style={{
														backgroundColor: "#ffffff",
														color: "#5f5f5f",
														borderColor: "#7D7AB9",
														width: "200px",
													}}
													className="sku-btn shadow-none"
												>
													<img
														src="/images/download.svg"
														alt="download"
														className="icon-img sm"
														style={{ marginRight: ".5rem" }}
													/>
													Download Sample
												</Button>
											</CSVLink>
										</>
									) : (
										<>
											<CSVLink data={sampleData} filename="sku-gen-sample.csv">
												<Button
													style={{
														backgroundColor: "#ffffff",
														color: "#5f5f5f",
														borderColor: "#7D7AB9",
														width: "200px",
													}}
													className="sku-btn shadow-none"
												>
													<img
														src="/images/download.svg"
														alt="download"
														className="icon-img sm"
														style={{ marginRight: ".5rem" }}
													/>
													Download Sample
												</Button>
											</CSVLink>
										</>
									)}
									<div>
										<div className="fw-bolder fs-4 my-4">Enter SKU Length</div>
									</div>
									<div className="short-notes">
										You can decide the maximum length a SKU can have. For
										example if you select 15 as the SKU length the output will
										have SKU which are under of near 15 characters in length.
									</div>
									<div className="col-md-8 mt-3">
										<input
											type="number"
											min={10}
											max={50}
											value={value}
											onChange={(e) => setValue(e.target.value)}
											style={{ width: "100%", color: "#7D7AB9" }}
										/>
										{(value < 10 || value > 50) && (
											<label className="text-danger px-2">
												SKU length should be from 10 to 50
											</label>
										)}
									</div>
								</div>
								<div className="p-4">
									{contextHolder}
									<FileUploader
										name="file"
										types={fileTypes}
										classes="drag-and-drop"
										handleChange={importDataFromCsv}
										onTypeError={error}
									>
										<div className="d-flex flex-column justify-content-center align-items-center">
											<img
												src="/images/upload.svg"
												alt="upload"
												className="drag-and-drop-box-img"
											/>
											<p style={{ fontWeight: "bold" }}>
												Drag and Drop Your File Here
											</p>
											<p style={{ fontWeight: "bold" }}>OR</p>
											<Button
												className="px-5"
												style={{ backgroundColor: "#7d7ab9" }}
											>
												Browse Files
											</Button>
											<div className="short-notes text-center">
												<p>Only CSV can be uploaded</p>
												<p>
													The output file will have a SKU column with the result
												</p>
											</div>
										</div>
									</FileUploader>
								</div>
							</div>
						</div>

						<div className="p-4 bg-white mt-3">
							<div className="fw-bolder fs-4 my-4">Example CSV File</div>
							<div>
								<img
									src="/images/sample-image-sku.jpg"
									className="img-fluid"
									alt="Responsive image"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UI;
